import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prismadb"
import axios from "axios"
import { Guild } from "@/models/Guild"
import { Collection } from "@discordjs/collection"
import { OAuth2Guild } from "discord.js"
import { DefaultJWT } from "next-auth/jwt"

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.JWT_SECRET!,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID!}&redirect_uri=${process.env.NEXTAUTH_URL}api%2Fauth%2Fcallback%2Fdiscord&response_type=code&scope=identify%20guilds%20guilds.join%20email`,
      profile: async (profile) => {
        return {
          id: profile.id,
          discordId: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.avatar
        }
      }
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (!account) return false
      const access_token = account.access_token
      if (!await prisma.user.findUnique({
        where: {
          id: user.id
        }
      })) {
        user.accessToken = access_token
        return true
      } else {
        await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            accessToken: access_token
          }
        })
      }
      return true
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.discordId = user.discordId
        token.servers = user.servers
        token.accessToken = user.accessToken
      }
      return token
    },
    session: async ({ session, token }) => {
      session.user.discordId = token.discordId
      session.user.accessToken = token.accessToken
      if (token.servers) {
        session.user.servers = token.servers
      } else {
        const discordId = token.discordId ?? session.user.discordId
        if (!discordId) return session
        const access_token = (await prisma.user.findUnique({
          where: {
            discordId: discordId
          }
        }))?.accessToken;
        const { data: userGuilds }: { data: Guild[] } = await axios.get("https://discord.com/api/users/@me/guilds", {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        })
        const { data: botGuilds }: { data: Collection<string, OAuth2Guild> } = await axios.get("http://bot/guilds")
        const botGuildIds = botGuilds.map(g => g.id);
        const guilds = userGuilds.filter(g => botGuildIds.includes(g.id))
        session.user.servers = guilds
      }
      return session
    }
  }
})

declare module "next-auth/core/types" {
  export interface User extends DefaultUser {
    discordId?: string;
    servers?: Guild[];
    accessToken?: string;
  }

  export interface Session extends DefaultSession {
    user: User;
  }
}

declare module "next-auth/jwt" {
  export interface JWT extends DefaultJWT {
    discordId?: string;
    servers?: Guild[];
    accessToken?: string;
    isBot?: boolean;
  }
}
