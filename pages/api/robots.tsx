import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | undefined | { error: string }>
) {
  if (req.method !== "GET") return res.status(405).end();

  res.setHeader("Content-Type", "text/plain");
  if (process.env.DB_ENV && process.env.DB_ENV === "production") {
    return res.send("User-agent: *\nAllow: /$\nAllow: /fr$\nDisallow: /");
  }

  res.send("User-agent: *\nDisallow: /");
}
