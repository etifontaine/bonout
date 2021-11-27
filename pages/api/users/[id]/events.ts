import type { NextApiRequest, NextApiResponse } from "next";
import type { BoEvent } from "../../../../src/types";
import { RequestError } from "../../../../src/utils/CustomErrors";
import { API_ERROR_MESSAGES } from "../../../../src/utils/errorMessages";
import { getEventsByUserID } from "../../../../src/models/events";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoEvent[] | { error: string }>
) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const events = await getEventsByUserID(getIdParameter(req));
    res.status(200).json(events);
  } catch (err) {
    if (err instanceof RequestError) {
      res.status(400).json({ error: err.message });
    } else {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  function getIdParameter(req: NextApiRequest): string {
    if (!req.query.id)
      throw new RequestError(API_ERROR_MESSAGES.MISSING_PARAMETER);
    if (typeof req.query.id !== "string")
      throw new RequestError(API_ERROR_MESSAGES.INVALID_PARAMETER);
    return req.query.id;
  }
}
