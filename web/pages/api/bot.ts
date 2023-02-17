// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth"

type RequestBody = {
  command: string;
  userId: string;
  guildId: string;
  params: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // const session = await getServerSession(req);
    // if (!session) {
    //   res.status(401).json({ status: "error", message: "Unauthorized" });
    //   return;
    // }
    const { command, userId, guildId, params } = req.body as RequestBody;
    const {data: result, status} = await axios.post("http://bot/command", {command, userId, guildId, params})
    res.status(status).json(result);
  }
}