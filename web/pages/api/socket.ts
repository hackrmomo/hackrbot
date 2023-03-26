import { Server as IOServer, Socket } from "socket.io"
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as HTTPServer } from 'http'
import { Socket as NetSocket, SocketAddress } from 'net'
import { encode, getToken } from "next-auth/jwt"
import axios from "axios"
import { registerSocketCommands } from "@/lib/server-socket-commands"

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

export interface NextApiRequestWithSocket extends NextApiRequest {
  socket: SocketWithIO
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

export default async function handler(
  req: NextApiRequestWithSocket,
  res: NextApiResponseWithSocket
) {
  const token = await encode({
    secret: process.env.JWT_SECRET!,
    maxAge: -1,
    token: {
      isBot: true,
    }
  })
  await axios.post("http://bot/authorize-bot", {
    token,
  })
  if (!req.socket.server.io) {
    console.log("Initializing Socket.io");
    const io = new IOServer(req.socket.server);
    req.socket.server.io = io;
    io.on("connection", (socket) => {
      registerSocketCommands(socket, req);
    });
  }
  res.end();
}