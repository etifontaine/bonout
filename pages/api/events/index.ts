import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import type { BoEvent } from "../../../src/types";
import { getEvents, createEvent } from "../../../src/models/events";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoEvent[] | { error: string } | { message: string }>
) {
  try {
    await getEventsHandler();
    await createEventHandler();
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }

  async function getEventsHandler() {
    if (isNotGetRequest()) return;

    return res.status(200).json(await getEvents());

    function isNotGetRequest(): boolean {
      return req.method !== "GET";
    }
  }

  async function createEventHandler() {
    if (isNotPostRequest()) return;
    if (isBodyEmpty())
      return res.status(400).json({ error: "body must be set" });

    const payload = getBodyPayload();
    if (!payload) return res.status(400).json({ error: "payload must be set" });

    return await createEvent(setUniqLink(payload))
      .then((event) => {
        return res.status(201).json({ message: event.link });
      })
      .catch((e) => {
        return res.status(500).json({ error: e.message });
      });

    function isNotPostRequest(): boolean {
      return req.method !== "POST";
    }

    function isBodyEmpty(): boolean {
      return !req.body;
    }

    function getBodyPayload(): BoEvent {
      return JSON.parse(req.body);
    }

    function setUniqLink(payload: BoEvent): BoEvent {
      return { ...payload, link: uuidv4() };
    }
  }
}
