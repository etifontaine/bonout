import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "firebase-admin";
import ShortUniqueId from "short-unique-id";
import type { BoEvent } from "../../../src/types";
import { RequestError } from "../../../src/utils/CustomErrors";
import { API_ERROR_MESSAGES } from "../../../src/utils/errorMessages";
import { getEvents, createEvent } from "../../../src/models/events";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoEvent[] | { error: string } | BoEvent>
) {
  try {
    if (isGetRequest())
      await getEvents().then((events) => res.status(200).json(events));

    if (isPostRequest())
      await createEventHandler().then((event) => {
        return res.status(201).json(event);
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
    return await createEvent(setLink(setUserId(getBodyPayload())));

    function setLink(payload: BoEvent): BoEvent {
      const uid = new ShortUniqueId({ length: 10 });
      return {
        ...payload,
        link: uid(),
      };
    }

    function setUserId(payload: BoEvent): BoEvent {
      const uid = new ShortUniqueId({ length: 10 });
      return {
        ...payload,
        user_id: payload.user_id && payload.user_id !== "undefined" ? payload.user_id : uid(),
      };
    }

    function getBodyPayload(): BoEvent {
      return checkEventTypes(
        checkIfPorpertyMissing(checkJSONSyntax(checkIfBodyEmpty(req.body)))
      );

      function checkIfBodyEmpty(body: string): string {
        if (!body) throw new RequestError(API_ERROR_MESSAGES.BODY_EMPTY);
        return body;
      }

      function checkJSONSyntax(json: string) {
        try {
          return JSON.parse(json);
        } catch (err) {
          throw new RequestError(API_ERROR_MESSAGES.BODY_NOT_JSON);
        }
      }

      function checkIfPorpertyMissing(event: BoEvent) {
        const missingProperty = fieldsToCheck().filter(isPropertyMissing);
        if (missingProperty.length > 0) {
          throw new RequestError(
            missingProperty.join(", ") + API_ERROR_MESSAGES.PROPERTY_NOT_FOUND
          );
        }
        return event;

        function isPropertyMissing(field: string): boolean {
          return (
            Object.keys(event)
              .filter((key) => fieldsToCheck().includes(key))
              .indexOf(field) === -1
          );
        }
      }

      function checkEventTypes(event: BoEvent): BoEvent {
        Object.entries(event)
          .filter(([key]) => fieldsToCheck().includes(key))
          .map(([key, value]) => ({
            key,
            value,
          }))
          .forEach((field) => {
            if (!isString(field.value))
              throw new RequestError(
                field.key + API_ERROR_MESSAGES.SHOULD_BE_STRING
              );
            if (isEmpty(field.value))
              throw new RequestError(
                field.key + API_ERROR_MESSAGES.SHOULD_NOT_BE_EMPTY
              );
          });

        return event;

        function isString(element: any): boolean {
          return typeof element === "string";
        }
        function isEmpty(s: any): boolean {
          return !s || !s.trim();
        }
      }
      function fieldsToCheck() {
        return ["title", "description", "address", "start_at", "end_at"];
      }
    }
  }
}
