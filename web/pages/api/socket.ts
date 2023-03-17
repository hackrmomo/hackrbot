import { Server as IOServer, Socket } from "socket.io"
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as HTTPServer } from 'http'
import { Socket as NetSocket, SocketAddress } from 'net'
import { getToken } from "next-auth/jwt"
import axios from "axios"

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiRequestWithSocket extends NextApiRequest {
  socket: SocketWithIO
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

export default async function handler(
  req: NextApiRequestWithSocket,
  res: NextApiResponseWithSocket
) {
  if (!req.socket.server.io) {
    console.log("Initializing Socket.io");
    const io = new IOServer(req.socket.server);
    req.socket.server.io = io;
    io.on("connection", (socket) => {
      socket.on("bot-command", async ({command, guildId, params}: {command: string, guildId: string, params?: {[key: string]: any}}) => {
        const token = await getToken({ req, secret: process.env.JWT_SECRET })
        if (!token) {
          socket.emit("error", "Not authenticated");
          return;
        };
        const userId = token.discordId;
        console.log("Received command: ", command, userId, guildId, params);
        const { data } = await axios.post("http://bot/command", { command, userId, guildId, params })
        socket.broadcast.emit("command", data);
      });
    });
  }
  res.end();
}