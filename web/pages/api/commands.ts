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
  if (req.method === "GET") {
    const {data: result, status} = await axios.get("http://bot/commands")
    res.status(status).json(result);
  }
}