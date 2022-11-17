import type { NextApiRequest, NextApiResponse } from "next";
import ShortUniqueId from "short-unique-id";
import type { BoEvent } from "@src/types";
import { RequestError } from "@src/utils/CustomErrors";
import { API_ERROR_MESSAGES } from "@src/utils/errorMessages";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  isOrganizerOf,
} from "@src/models/events";
import { pipe } from "fp-ts/lib/function";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    BoEvent[] | { error: string } | { message: string } | BoEvent
  >
) {
  try {
    if (isDeleteRequest())
      await deleteEventHandler().then(() =>
        res.status(200).json({ message: "Event deleted" })
      );
    if (isPostRequest())
      await createEventHandler().then((event) => {
        return res.status(201).json(event);
      });

    if (isPutRequest())
      await updateEventHandler().then(() => {
        return res.status(201).json({ message: "Event updated" });
      });
  } catch (err: any) {
    if (err instanceof RequestError) {
      res.status(400).json({ error: err.message });
    } else {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  function isPostRequest(): boolean {
    return req.method === "POST";
  }

  function isPutRequest(): boolean {
    return req.method === "PUT";
  }

  function isDeleteRequest(): boolean {
    return req.method === "DELETE";
  }

  async function createEventHandler(): Promise<BoEvent> {
    return pipe(
      getBodyPayload(),
      checkIfPorpertyMissing(fieldsToCheck()),
      checkEventTypes(fieldsToCheck()),
      setUserId,
      setLink,
      createEvent
    );

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
        user_id:
          payload.user_id && payload.user_id !== "undefined"
            ? payload.user_id
            : uid(),
      };
    }
  }

  async function updateEventHandler(): Promise<void> {
    return pipe(
      getBodyPayload(),
      checkIfPorpertyMissing([...fieldsToCheck(), "id"]),
      checkEventTypes([...fieldsToCheck(), "id"]),
      checkIfUserIsOrganizer
    ).then(updateEvent);
  }

  function fieldsToCheck() {
    return [
      "title",
      "description",
      "address",
      "start_at",
      "end_at",
      "user_name",
    ];
  }

  async function deleteEventHandler(): Promise<void> {
    return await pipe(
      getBodyPayload(),
      checkIfPorpertyMissing(["id", "user_id"]),
      checkEventTypes(["id", "user_id"]),
      checkIfUserIsOrganizer
    ).then(({ id }) => deleteEvent(id));
  }

  async function checkIfUserIsOrganizer(event: BoEvent): Promise<BoEvent> {
    if (!(await isOrganizerOf(event.user_id, event.id)))
      throw new RequestError(API_ERROR_MESSAGES.NOT_ORGANIZER);
    return event;
  }

  function getBodyPayload(): BoEvent {
    return checkJSONSyntax(checkIfBodyEmpty(req.body));

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
  }

  function checkIfPorpertyMissing(fieldsToCheck: string[]) {
    return (event: BoEvent) => {
      const missingProperty = fieldsToCheck.filter(isPropertyMissing);
      if (missingProperty.length > 0) {
        throw new RequestError(
          missingProperty.join(", ") + API_ERROR_MESSAGES.PROPERTY_NOT_FOUND
        );
      }
      return event;

      function isPropertyMissing(field: string): boolean {
        return (
          Object.keys(event)
            .filter((key) => fieldsToCheck.includes(key))
            .indexOf(field) === -1
        );
      }
    };
  }

  function checkEventTypes(fieldsToCheck: string[]) {
    return (event: BoEvent) => {
      Object.entries(event)
        .filter(([key]) => fieldsToCheck.includes(key))
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
    };
  }
}
