import type { NextApiRequest, NextApiResponse } from "next";
import type { BoEvent } from "../../../src/types";
import { getEventByID, getEventByLink } from "../../../src/models/events";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoEvent | { error: string }>
) {
  const { param } = req.query;

  if (!param)
    return res.status(400).end();

  if (req.method === "GET") {
    let event: BoEvent | null
    switch (param[0]) {
      case 'link':
        event = await getEventByLink(param[1]);
        break;
      case 'id':
        event = await getEventByID(param[1]);
        break;
      default:
        event = null
    }
    if (!event)
      return res
        .status(404)
        .json({ error: "Event not found !" });
    res.status(200).json(event);
  }
}
