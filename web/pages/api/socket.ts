import { Server as IOServer, Socket } from "socket.io"
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'
import { getServerSession } from "next-auth"

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
    const io = new IOServer(req.socket.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    req.socket.server.io = io;
    io.on("connection", (socket) => {
      console.log("a user connected");
    });
  }
  res.end();
}