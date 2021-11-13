import type { NextApiRequest, NextApiResponse } from "next";
import type { BoEvent } from "../../../src/types";
import { getEvent } from "../../../src/models/events";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoEvent | { error: string }>
) {
  // if post

  const { id } = req.query;
  if (!id || Array.isArray(id))
    return res.status(400).end();

  if (req.method === "GET") {
    const event = await getEvent(id);
    if (!event)
      return res
        .status(404)
        .json({ error: "Event not found !" });
    res.status(200).json(event);
  }
}
