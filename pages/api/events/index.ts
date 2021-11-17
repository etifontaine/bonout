import type { NextApiRequest, NextApiResponse } from "next";
import ShortUniqueId from 'short-unique-id';
import type { BoEvent } from "../../../src/types";
import {
  getEvents,
  createEvent,
} from "../../../src/models/events";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoEvent[] | { error: string } | { message: string }>
) {
  if (req.method === "GET") {
    const events = await getEvents();
    if (!events) return res.status(500).json({ error: "Failed to get events" });

    return res.status(200).json(events);
  }

  if (req.method === "POST") {
    if (!req.body) {
      return res.status(400).json({ error: "body must be set" });
    }

    let payload: BoEvent | null = null;
    try {
      payload = JSON.parse(req.body);
    } catch (error) {
      return res.status(400).json({ error: "can not parse body" });
    }

    if (!payload) {
      return res.status(400).json({ error: "payload must be set" });
    }

    const uid = new ShortUniqueId({ length: 10 });
    payload.link = uid()

    return await createEvent(payload)
      .then((event) => {
        return res.status(201).json({ message: event.link });
      })
      .catch((e) => {
        return res.status(500).json({ error: e.message });
      });
  }
}
