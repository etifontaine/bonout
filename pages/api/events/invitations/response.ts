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
import { checkFirebaseAuth } from "@src/firebase/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | BoInvitationResponse
    | { error: string }
    | { message: string; user_id: string }
  >
) {
  if (req.method !== "POST") {
    return res
      .status(400)
      .json({ error: API_ERROR_MESSAGES.METHOD_NOT_ALLOWED });
  }

  const appCheck = await checkFirebaseAuth(
    req.headers["x-firebase-appcheck"] as string
  );

  if (appCheck.error) return res.status(401).send({ error: appCheck.message });

  await handleCreateUpdateBoInvitationRes(req).then(
    E.fold(
      ([message, exception]) => {
        if (exception) logger.error(exception, message);
        res.status(exception ? 500 : 400).json({ error: message });
      },
      ([invitation, event]) =>
        res.status(201).json({
          message: invitation.user_id === event.user_id ? "updated" : "created",
          user_id: invitation.user_id,
        })
    )
  );
}

function handleCreateUpdateBoInvitationRes(req: NextApiRequest) {
  return pipe(
    validateJson(req.body),
    E.chain(
      validateProperties<BoInvitationResponse>(["link", "name", "response"])
    ),
    E.chain(
      E.fromPredicate(
        (payload) =>
          Object.values(BoInvitationValidResponse).includes(payload.response),
        (payload) => `${payload.response} is not a valid response`
      )
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
            : TE.right([payload, event] as [
                BoInvitationResponse & { user_id: string },
                BoEvent
              ])
        )
      )
    ),
    TE.mapLeft((error) => [error, null] as [string, null | unknown]),
    TE.chain(([payload, event]) =>
      pipe(
        TE.sequenceArray([
          TE.tryCatch(
            () =>
              payload.user_id !== event.user_id
                ? createInvitationResponse(event.id, payload)
                : updateInvitationResponse(event.id, payload),
            (e): [string, unknown] => [
              "error while creating invitation response",
              e,
            ]
          ),
          TE.tryCatch(
            () =>
              createNotification({
                created_at: new Date().toISOString(),
                message: {
                  responseUserName: payload.name,
                  response: payload.response,
                  eventTitle: event.title,
                },
                isRead: false,
                link: payload.link,
                organizer_id: event.user_id,
              }),
            (e): [string, unknown] => ["error while creating notification", e]
          ),
        ]),
        TE.map(() => [payload, event])
      )
    )
  )();
}
