import type { NextApiRequest, NextApiResponse } from "next";
import type { BoEvent } from "../../../src/types";
import { getEvents } from "../../../src/models/events";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoEvent[]>
) {
  const events = await getEvents();
  if (!events) throw new Error("No events found");
  res.status(200).json(events);
}
