import type { NextApiRequest, NextApiResponse } from "next";
import type { BoNotification } from "@src/types";
import { getUserNotifications } from "@src/models/events";
import { pipe } from "fp-ts/lib/function";
import * as E from "fp-ts/lib/Either";
import { checkFirebaseAuth } from "@src/firebase/auth";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { error: string } | { message: string } | Array<BoNotification>
  >
) {
  const appCheck = await checkFirebaseAuth(
    req.headers["x-firebase-appcheck"] as string
  );

  if (appCheck.error) return res.status(401).send({ error: appCheck.message });

  if (req.method === "GET") {
    try {
      return pipe(
        req.query.id,
        (id) =>
          typeof id !== "string" ? E.left("id is not a string") : E.right(id),
        E.map(getUserNotifications),
        E.fold(
          (e) => res.status(400).json({ error: e }),
          (n) =>
            n.then((x) => {
              res.status(200).json(x);
            })
        )
      );
    } catch (e) {
      //@ts-ignore
      res.status(500).json({ error: e.message });
    }
  }
}
