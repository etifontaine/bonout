import type { NextApiRequest, NextApiResponse } from "next";
import ShortUniqueId from "short-unique-id";
import type { BoEvent, BoNotification } from "@src/types";
import { RequestError } from "@src/utils/CustomErrors";
import { API_ERROR_MESSAGES } from "@src/utils/errorMessages";
import {
  createNotification,
  deleteNotification,
  updateNotificationIsRead,
} from "@src/models/events";
import { pipe, flow } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { filter } from "fp-ts/lib/Array";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ error: string } | { message: string }>
) {
  if (req.method === "POST") {
    return pipe(
      processBodyForNotificationCreate(req.body),
      E.map(createNotification),
      E.fold(
        (e) => res.status(400).json({ error: e }),
        (n) => n.then(() => res.json({ message: "Notification Created" }))
      )
    );
  }
}

function processBodyForNotificationCreate(body: string) {
  return pipe(
    validateJson(body),
    E.chain(validateProperties(["isRead", "user_id", "event_id", "message"])),
    E.map((body) => ({
      ...body,
      created_at: new Date().toISOString(),
    }))
  );
}

function validateJson(toParse: string) {
  return E.tryCatch(
    () => JSON.parse(toParse),
    () => API_ERROR_MESSAGES.BODY_NOT_JSON
  );
}

function validateProperties(properties: Array<string>) {
  return (body: { [key: string]: any }) =>
    pipe(
      properties,
      filter((key) => !(key in body)),
      (keys) =>
        keys.length === 0
          ? E.right(body as BoNotification)
          : E.left(API_ERROR_MESSAGES.VALUE_MISSING + " : " + keys.join(", "))
    );
}
