import type { NextApiRequest, NextApiResponse } from "next";
import type { BoNotification } from "@src/types";
import { validateJson, validateProperties } from "@src/utils/api";
import { updateNotificationIsRead } from "@src/models/events";
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
  if (req.method === "PUT") {
    return pipe(
      validateJson(req.body),
      E.chain(
        validateProperties<{ user_id: string; id: string }>(["user_id", "id"])
      ),
      E.map(updateNotificationIsRead),
      E.fold(
        (e) => res.status(400).json({ error: e }),
        (n) => n.then(() => res.json({ message: "Notification updated" }))
      )
    );
  }
}
