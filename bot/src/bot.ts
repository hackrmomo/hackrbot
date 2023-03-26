import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { commands } from "./config";
import { music, registerEvents } from "./music";
import { performInteraction } from "./interactor";
import "./api";
import { Player } from "discord-player";
import { io, Socket } from "socket.io-client"

export let socket: Socket;

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.MessageContent,
  ]
});

export const connectToSocket = async (token: string) => {
  if (socket) {
    // already connected
    return;
  }
  socket = io("http://web/", {
    auth: {
      token
    }
  });
  socket.on("connect", async () => {
    console.log("Connected to socket");
    await registerEvents();
  });
}


export const player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
    filter: "audioonly",
    dlChunkSize: 0,
  },
  smoothVolume: true,
  connectionTimeout: 10000,
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  await performInteraction(interaction);
});

const startBot = (async () => {
  await client.login(process.env.HACKRBOT_TOKEN);
  const rest = new REST({ version: "10" }).setToken(process.env.HACKRBOT_TOKEN!);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationCommands(
        process.env.DISCORD_CLIENT_ID!,
      ),
      {
        body: commands,
      }
    );

    console.log("Successfully reloaded application (/) commands.");

  } catch (error) {
    console.error(error);
  }
});

startBot();

const healthCheck: (finalCheck: boolean) => Promise<{ status: "error" | "ok" }> = async (finalCheck = false) => {
  if (client) {
    return { status: "ok" };
  } else {
    if (finalCheck) return { status: "error" };
    await startBot();
    return await healthCheck(true);
  };
};

export const bot = {
  healthCheck,
  music
};