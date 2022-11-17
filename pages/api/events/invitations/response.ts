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
import { pipe, flow } from "fp-ts/lib/function";
import { validateJson, validateProperties } from "@src/utils/api";
import { WriteResult } from "firebase-admin/firestore";

type BoInvitationResponseDefined = BoInvitationResponse & {
  user_id: string;
  created_at: string;
};

const safeGetPostRequest: (
  r: NextApiRequest
) => E.Either<string, NextApiRequest> = E.fromPredicate(
  ({ method }) => method === "POST",
  () => API_ERROR_MESSAGES.METHOD_NOT_ALLOWED
);

const validateResponseProp: (
  x: BoInvitationResponse
) => E.Either<string, BoInvitationResponse> = E.fromPredicate(
  ({ response }) => Object.values(BoInvitationValidResponse).includes(response),
  ({ response }) => `${response} is not a valid response`
);

const safeGetBodyPayload: (
  r: NextApiRequest
) => E.Either<string, BoInvitationResponse> = flow(
  (r) => r.body,
  validateJson,
  E.chain(
    validateProperties<BoInvitationResponse>(["name", "link", "response"])
  ),
  E.chain(validateResponseProp)
);

const safeGetEventByLink: (link: string) => TE.TaskEither<string, BoEvent> =
  flow(
    (link) => () => getEventByLink(link, { withUserIDs: true }),
    T.map(E.fromNullable(`event was not found with this link`))
  );

const fillInvitationResponse: (
  ir: BoInvitationResponse
) => BoInvitationResponseDefined = (ir) => ({
  ...ir,
  user_id: ir.user_id || new ShortUniqueId({ length: 10 })(),
  created_at: ir.created_at || new Date().toUTCString(),
});

const createOrUpdateInvitationResponseTask: (payload: {
  event: BoEvent;
  invitationResponse: BoInvitationResponseDefined;
}) => TE.TaskEither<[string, unknown], WriteResult> = ({
  event,
  invitationResponse: ir,
}) =>
  TE.tryCatch(
    () =>
      event.user_id !== ir.user_id
        ? createInvitationResponse(event.id, ir)
        : updateInvitationResponse(event.id, ir),
    (e): [string, unknown] => ["error while creating invitation response", e]
  );

const createNotificationTask: (payload: {
  event: BoEvent;
  invitationResponse: BoInvitationResponseDefined;
}) => TE.TaskEither<[string, unknown], WriteResult> = ({
  event,
  invitationResponse: ir,
}) =>
  TE.tryCatch(
    () =>
      createNotification({
        created_at: new Date().toISOString(),
        message: {
          responseUserName: ir.name,
          response: ir.response,
          eventTitle: event.title,
        },
        isRead: false,
        link: ir.link,
        organizer_id: event.user_id,
      }),
    (e): [string, unknown] => ["error while creating notification", e]
  );

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | BoInvitationResponse
    | { error: string }
    | { message: string; user_id: string }
  >
) {
  await pipe(
    TE.Do,
    TE.bind("invitationResponse", () =>
      pipe(
        safeGetPostRequest(req),
        E.chain(safeGetBodyPayload),
        E.map(fillInvitationResponse),
        TE.fromEither
      )
    ),
    TE.bind("event", ({ invitationResponse }) =>
      safeGetEventByLink(invitationResponse.link)
    ),
    TE.mapLeft((error) => [error, null] as [string, null | unknown]),
    TE.chainFirst(createOrUpdateInvitationResponseTask),
    TE.chainFirst(createNotificationTask)
  )().then(
    E.fold(
      ([message, exception]) => {
        if (exception) logger.error(exception, message);
        res.status(exception ? 500 : 400).json({ error: message });
      },
      ({ invitationResponse: ir, event }) =>
        res.status(201).json({
          message: ir.user_id === event.user_id ? "updated" : "created",
          user_id: ir.user_id,
        })
    )
  );
}
