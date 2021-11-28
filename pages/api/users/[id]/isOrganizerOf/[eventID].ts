import type { NextApiRequest, NextApiResponse } from "next";
import { RequestError } from "src/utils/CustomErrors";
import { API_ERROR_MESSAGES } from "src/utils/errorMessages";
import { isOrganizerOf } from "src/models/events";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<boolean | { error: string }>
) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const itIs = await isOrganizerOf(
      getUserIdParameter(req),
      getEventIdParameter(req)
    );
    res.status(200).json(itIs);
  } catch (err) {
    if (err instanceof RequestError) {
      res.status(400).json({ error: err.message });
    } else {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  function getUserIdParameter(req: NextApiRequest): string {
    if (!req.query.id)
      throw new RequestError(API_ERROR_MESSAGES.MISSING_PARAMETER);
    if (typeof req.query.id !== "string")
      throw new RequestError(API_ERROR_MESSAGES.INVALID_PARAMETER);
    return req.query.id;
  }

  function getEventIdParameter(req: NextApiRequest): string {
    if (!req.query.eventID)
      throw new RequestError(API_ERROR_MESSAGES.MISSING_PARAMETER);
    if (typeof req.query.eventID !== "string")
      throw new RequestError(API_ERROR_MESSAGES.INVALID_PARAMETER);
    return req.query.eventID;
  }
}
