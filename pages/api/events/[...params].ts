import type { NextApiRequest, NextApiResponse } from "next";
import type { BoEvent } from "../../../src/types";
import { getEventByID, getEventByLink } from "../../../src/models/events";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoEvent | { error: string }>
) {
  if (isNotGetRequest()) return;

  try {
    const event = await getEventHandler();
    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ error: "Event not found !" });
    }
  } catch (e: any) {
    console.error(e);
    res.status(404).json({ error: e.message });
  }

  function isNotGetRequest(): boolean {
    return req.method !== "GET";
  }

  async function getEventHandler(): Promise<BoEvent | null> {
    if (isUnknownParameter()) throw new Error("Unknown parameter");
    if (isValueMissing()) throw new Error(`${getFirstParam()} value missing`);

    if (isLinkParam()) return await getEventByLink(getSecondParam());
    if (isIdParam()) return await getEventByID(getSecondParam());

    return null;

    function isUnknownParameter(): boolean {
      return ["id", "link"].indexOf(getFirstParam()) === -1;
    }

    function isValueMissing() {
      return !getSecondParam();
    }

    function isLinkParam() {
      return getFirstParam() === "link";
    }

    function isIdParam() {
      return getFirstParam() === "id";
    }

    function getFirstParam() {
      return req.query.params[0];
    }

    function getSecondParam() {
      return req.query.params[1];
    }
  }
}
