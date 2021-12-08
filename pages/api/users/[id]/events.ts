import type { NextApiRequest, NextApiResponse } from "next";
import type { BoEvent } from "@src/types";
import { RequestError } from "@src/utils/CustomErrors";
import { API_ERROR_MESSAGES } from "@src/utils/errorMessages";
import {
  getEventsByUserID,
  getEventsFromUserInvitations,
} from "@src/models/events";
import { filterBy, sortByDate } from "@src/utils/array";
import logger from "@src/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoEvent[] | { error: string }>
) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const events = await getEventsByUserID(getIdParameter(req));
    const eventsInvitations = await getEventsFromUserInvitations(
      getIdParameter(req)
    );
    const allEvents = [...events, ...eventsInvitations];
    const filteredEvents = filterBy(
      sortByDate(
        allEvents.filter((n) => n),
        "start_at"
      ),
      "id"
    );
    res.status(200).json(filteredEvents);
  } catch (err) {
    if (err instanceof RequestError) {
      res.status(400).json({ error: err.message });
    } else {
      logger.error(err);
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
