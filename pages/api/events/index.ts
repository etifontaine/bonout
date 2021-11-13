import type { NextApiRequest, NextApiResponse } from "next";
import type { BoEvent } from "../../../src/types";
import {
  getEvents,
  createEvent,
  getEventByLink,
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

    return res.status(200).json(events);
  }

  if (req.method === "POST") {
    if (!req.body) {
      return res.status(400).json({ error: 'body must be set' })
    }

    let payload: BoEvent | null = null
    try {
      payload = JSON.parse(req.body);
    } catch (error) {
      return res.status(400).json({ error: 'can not parse body' })
    }

    if (!payload) {
      return res.status(400).json({ error: 'payload must be set' })
    }

    // check if an event already exist with this link
    const eventExist = await getEventByLink(payload.link)
    if (eventExist) {
      payload.link += `-${Math.random().toString(36).substr(2, 9)}`
    }

    return await createEvent(payload)
      .then(() => {
        return res.status(204).json({ message: "success" });
      })
      .catch(e => {
        return res.status(500).json({ error: e.message });
      });
  }
}
