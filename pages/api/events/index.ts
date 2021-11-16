import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import type { BoEvent } from "../../../src/types";
import { RequestError } from "../../../src/utils/CustomErrors";
import { getEvents, createEvent } from "../../../src/models/events";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoEvent[] | { error: string } | { message: string }>
) {
  try {
    if (isGetRequest())
      await getEvents().then((events) => res.status(200).json(events));

    if (isPostRequest())
      await createEventHandler().then((event) => {
        return res.status(201).json({ message: event.link });
      });
  } catch (err: any) {
    if (err instanceof RequestError) {
      res.status(400).json({ error: err.message });
    } else {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  function isGetRequest(): boolean {
    return req.method === "GET";
  }

  function isPostRequest(): boolean {
    return req.method === "POST";
  }

  async function createEventHandler(): Promise<BoEvent> {
    if (isBodyEmpty()) throw new RequestError("Body is empty");

    return await createEvent(setUniqLink(getBodyPayload()));

    function isBodyEmpty(): boolean {
      return !req.body;
    }

    function setUniqLink(payload: BoEvent): BoEvent {
      return { ...payload, link: uuidv4() };
    }

    function getBodyPayload(): BoEvent {
      return checkEventTypes(checkJSONSyntax(req.body));

      function checkJSONSyntax(json: string) {
        try {
          return JSON.parse(json);
        } catch (err) {
          throw new RequestError("Body is not a valid JSON");
        }
      }

      function checkEventTypes(event: BoEvent): BoEvent {
        fieldsToCheck().forEach((field) => {
          if (!isString(field))
            throw new RequestError(`${field} must be a string !`);
          if (isEmpty(field))
            throw new RequestError(`${field} must not be empty !`);
        });

        return event;

        function fieldsToCheck(): string[] {
          return [
            event.title,
            event.description,
            event.address,
            event.start_at,
            event.end_at,
            event.user_id,
          ];
        }

        function isString(element: any): boolean {
          return typeof element === "string";
        }
        function isEmpty(s: string): boolean {
          return !s || !s.trim();
        }
      }
    }
  }
}
