import type { NextApiRequest, NextApiResponse } from "next";
import {
  BoEvent,
  BoInvitationResponse,
  BoInvitationValidResponse,
} from "../../../../src/types";
import {
  createInvitationResponse,
  deleteInvitationResponse,
  getEventByLink,
} from "../../../../src/models/events";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    BoInvitationResponse | { error: string } | { message: string }
  >
) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "method is not accepted" });
  }
  if (!req.body) {
    return res.status(400).json({ error: "body must be set" });
  }

  let payload: BoInvitationResponse | null = null;
  try {
    payload = JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: "can not parse body" });
  }

  if (!payload) {
    return res.status(400).json({ error: "payload must be set" });
  }
  if (!payload.link) {
    return res.status(400).json({ error: "link must be set" });
  }
  if (!payload.name) {
    return res.status(400).json({ error: "name must be set" });
  }
  if (!Object.values(BoInvitationValidResponse).includes(payload.response)) {
    return res
      .status(400)
      .json({ error: `${payload.response} is not a valid response` });
  }

  payload.created_at = new Date().toUTCString();

  const event = await getEventByLink(payload.link);
  if (!event) {
    return res
      .status(400)
      .json({ error: "event was not found with this link" });
  }

  // Response was already added with for name
  const existingInvitation = event.invitations?.find(
    (invitation) => invitation.name === payload?.name
  );
  if (existingInvitation) {
    await deleteInvitationResponse(event.id, existingInvitation);
  }

  return await createInvitationResponse(event.id, payload)
    .then(() => {
      return res
        .status(201)
        .json({ message: existingInvitation ? "updated" : "created" });
    })
    .catch((e: { message: string }) => {
      return res.status(500).json({ error: e.message });
    });
}
