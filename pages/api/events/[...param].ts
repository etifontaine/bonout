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
    if (isLinkParam()) {
      if (thereIsNotValue()) throw new Error("Link value missing");
      return await getEventByLink(getSecondParam());
    }

    if (isIdParam()) {
      if (thereIsNotValue()) throw new Error("Id value missing");
      return await getEventByID(getSecondParam());
    }

    throw new Error("Unknown parameter");

    function thereIsNotValue() {
      return !getSecondParam();
    }

    function isLinkParam() {
      return req.query.param[0] === "link";
    }

    function isIdParam() {
      return req.query.param[0] === "id";
    }

    function getSecondParam() {
      return req.query.param[1];
    }
  }
}
