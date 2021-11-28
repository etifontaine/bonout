import type { NextApiRequest, NextApiResponse } from "next";
import { API_ERROR_MESSAGES } from "../../../../src/utils/errorMessages";
import {
  BoInvitationResponse,
  BoInvitationValidResponse,
} from "../../../../src/types";
import {
  createInvitationResponse,
  deleteInvitationResponse,
  getEventByLink,
} from "../../../../src/models/events";
import ShortUniqueId from "short-unique-id";

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
  if (!req.body) {
    return res.status(400).json({ error: API_ERROR_MESSAGES.BODY_EMPTY });
  }

  let payload: BoInvitationResponse | null = null;
  try {
    payload = JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: API_ERROR_MESSAGES.BODY_NOT_JSON });
  }

  if (!payload) {
    return res.status(400).json({ error: "payload must be set" });
  }
  if (!payload.link) {
    return res
      .status(400)
      .json({ error: "link" + API_ERROR_MESSAGES.PROPERTY_NOT_FOUND });
  }
  if (!payload.name) {
    return res
      .status(400)
      .json({ error: "name" + API_ERROR_MESSAGES.PROPERTY_NOT_FOUND });
  }
  if (!payload.response) {
    return res
      .status(400)
      .json({ error: "response" + API_ERROR_MESSAGES.PROPERTY_NOT_FOUND });
  }
  if (!Object.values(BoInvitationValidResponse).includes(payload.response)) {
    return res
      .status(400)
      .json({ error: `${payload.response} is not a valid response` });
  }

  payload.created_at = new Date().toUTCString();

  if (!payload.user_id || payload.user_id === "undefined") {
    const uid = new ShortUniqueId({ length: 10 });
    payload.user_id = uid();
  }

  const event = await getEventByLink(payload.link);
  if (!event) {
    return res
      .status(400)
      .json({ error: "event was not found with this link" });
  }

  // Response was already added with for name
  const existingInvitation = event.invitations?.find(
    (invitation) => invitation.user_id === payload?.user_id
  );
  if (existingInvitation) {
    await deleteInvitationResponse(event.id, existingInvitation);
  }

  return await createInvitationResponse(event.id, payload)
    .then(() => {
      return res.status(201).json({
        message: existingInvitation ? "updated" : "created",
        user_id: payload?.user_id,
      });
    })
    .catch((e: { message: string }) => {
      console.log(e);
      return res.status(500).json({ error: e.message });
    });
}
