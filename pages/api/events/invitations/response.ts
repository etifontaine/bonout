import type { NextApiRequest, NextApiResponse } from "next";
import { API_ERROR_MESSAGES } from "../../../../src/utils/errorMessages";
import * as E from "fp-ts/lib/Either";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import {
  BoEvent,
  BoInvitationResponse,
  BoInvitationValidResponse,
} from "../../../../src/types";
import {
  createInvitationResponse,
  createNotification,
  updateInvitationResponse,
  getEventByLink,
} from "../../../../src/models/events";
import ShortUniqueId from "short-unique-id";
import logger from "@src/logger";
import { pipe } from "fp-ts/lib/function";
import { validateJson, validateProperties } from "@src/utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    BoInvitationResponse | { error: string } | { message: string }
  >
) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({ error: API_ERROR_MESSAGES.METHOD_NOT_ALLOWED });
  }

  const lol = pipe(
    validateJson(req.body),
    E.chain(
      validateProperties<BoInvitationResponse>(["link", "name", "response"])
    ),
    E.chain((payload) =>
      !Object.values(BoInvitationValidResponse).includes(payload.response)
        ? E.left(`${payload.response} is not a valid response`)
        : E.right(payload)
    ),
    E.map((payload) => ({
      ...payload,
      user_id: payload.user_id || new ShortUniqueId({ length: 10 })(),
      created_at: payload.created_at || new Date().toUTCString(),
    })),
    TE.fromEither,
    TE.chain((payload) =>
      pipe(
        () => getEventByLink(payload.link, { withUserIDs: true }),
        T.chain((event) =>
          event === null
            ? TE.left("event was not found with this link")
            : TE.right([payload, event] as [BoInvitationResponse, BoEvent])
        )
      )
    ),
    TE.chain(([payload, event]) =>
      pipe(
        TE.sequenceArray([
          TE.tryCatch(
            () =>
              payload.user_id !== event.user_id
                ? createInvitationResponse(event.id, payload)
                : updateInvitationResponse(event.id, payload),
            () => "error while creating invitation response"
          ),
          TE.tryCatch(
            () =>
              createNotification({
                created_at: new Date().toISOString(),
                message: `${payload.name} à répondu ${payload.response} | ${event.title}`,
                isRead: false,
                link: payload.link,
                user_id: event.user_id,
              }),
            () => "error while creating notification"
          ),
        ]),
        TE.map(([invitation, notification]) => ({
          message: "Invitation updated",
          user_id: event.user_id,
        }))
      )
    ),
    TE.mapLeft((err) => ({ error: err })),
    TE.fold(
      (e) => T.of(res.status(400).json(e)),
      (x) => T.of(res.status(200).json(x))
    )
  );
}
