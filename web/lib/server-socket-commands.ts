import { Socket, Server } from 'socket.io';
import { NextApiRequestWithSocket } from '@/pages/api/socket';
import axios from "axios"
import { decode } from 'next-auth/jwt';
import { GuildStatus } from '@/models/GuildStatus';

export const registerSocketCommands = (socket: Socket, req: NextApiRequestWithSocket) => {
  socket.on("client-connect", async ({ guildId }: { guildId: string }) => {
    const { token } = socket.handshake.auth as { token: string };
    const jwt = await decode({ token, secret: process.env.JWT_SECRET! })
    if (!jwt) {
      socket.emit("client-connect-error", { guildId, error: "Invalid token" });
      return;
    }
    // eject user from all other rooms
    Object.keys(socket.rooms).forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    // join the guild's room if not already in it
    socket.join(guildId);
    // send ok back to client and only to the client
    socket.emit("client-connect-ok", { guildId });
  })

  socket.on("bot-command", async ({ command, guildId, params }: { command: string, guildId: string, params?: { [key: string]: any } }) => {
    const { token } = socket.handshake.auth as { token: string };
    const jwt = await decode({ token, secret: process.env.JWT_SECRET! })
    if (!jwt) {
      socket.emit("bot-command-error", { command, guildId, error: "Invalid token" });
      return;
    }
    // eject user from all other rooms
    Object.keys(socket.rooms).forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    // join the guild's room if not already in it
    socket.join(guildId);
    // send the command to the bot
    const { data } = await axios.post("http://bot/command", {
      command,
      guildId,
      userId: jwt.discordId,
      params,
    });
    // send the response back to all clients in the guild's room
    socket.to(guildId).emit("bot-command-response", { command, guildId, response: data });
  });

  socket.on("bot-heartbeat", async ({ guildId, data }: { guildId: string, data: GuildStatus }) => {
    const { token } = socket.handshake.auth as { token: string };
    const jwt = await decode({ token, secret: process.env.JWT_SECRET! })
    if (!jwt || !jwt.isBot) {
      socket.emit("bot-heartbeat-error", { guildId, error: "Invalid token" });
    }
    socket.broadcast.to(guildId).emit("bot-status", data);
  })
}