import type { NextApiRequest, NextApiResponse } from "next";
import type { BoEvent } from "../../../src/types";
import { RequestError } from "../../../src/utils/CustomErrors";
import { API_ERROR_MESSAGES } from "../../../src/utils/errorMessages";
import { getEventByID, getEventByLink } from "../../../src/models/events";
import { checkFirebaseAuth } from "@src/firebase/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoEvent | { error: string }>
) {
  if (isNotGetRequest()) return;

  const appCheck = await checkFirebaseAuth(
    req.headers["x-firebase-appcheck"] as string
  );
  if (appCheck.error) return res.status(401).send({ error: appCheck.message });

  await getEventHandler()
    .then((event) => {
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ error: "Event" + API_ERROR_MESSAGES.NOT_FOUND });
      }
    })
    .catch((err) => {
      if (err instanceof RequestError) {
        res.status(400).json({ error: err.message });
      } else {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

  function isNotGetRequest(): boolean {
    return req.method !== "GET";
  }

  async function getEventHandler(): Promise<BoEvent | null> {
    if (isUnknownParameter())
      throw new RequestError(API_ERROR_MESSAGES.UNKNOWN_PARAMETER);
    if (isValueMissing())
      throw new RequestError(
        getFirstParam() + API_ERROR_MESSAGES.VALUE_MISSING
      );

    if (isLinkParam()) return await getEventByLink(getSecondParam());
    if (isIdParam()) return await getEventByID(getSecondParam());

    throw new Error("Unreachable code, check guards conditions");

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
