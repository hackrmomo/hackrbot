// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {

    await prisma?.user.deleteMany();
    await prisma?.account.deleteMany();
    await prisma?.session.deleteMany();
    await prisma?.verificationToken.deleteMany();

    res.status(200).json({ status: "ok" });
  }
}