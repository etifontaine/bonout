import type { NextApiRequest, NextApiResponse } from "next";
import type { BoEvent } from "../../../src/types";
import {
  getEvents,
  createEvent,
} from "../../../src/models/events";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    BoEvent[] | { error: string } | { message: string }
  >
) {
  if (req.method === "GET") {
    const events = await getEvents();
    if (!events)
      return res
        .status(500)
        .json({ error: "Failed to get events" });

    res.status(200).json(events);
  }

  if (req.method === "POST") {
    const payload = JSON.parse(req.body);
    await createEvent(payload)
      .then(() => {
        res.status(204).json({ message: "Success" });
      })
      .catch(e => {
        res.status(500).json({ error: e.message });
      });
  }
}
