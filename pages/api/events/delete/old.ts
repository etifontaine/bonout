import type { NextApiRequest, NextApiResponse } from "next";
import { RequestError } from "@src/utils/CustomErrors";
import {
    deletePastEvents,
} from "@src/models/events";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<
        { error: string } | { message: string }
    >
) {
    try {
        if (isDeleteRequest()) {
            if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
                return res.status(401).json({ error: 'Missing Authorization Header' });
            }
            const authToken = req.headers.authorization.split(" ")[1]
            const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${authToken}`)
            const googleResponseParsed = await googleResponse.json()
            if (googleResponse.status > 300) {
                return res.status(googleResponse.status).json({ error: googleResponseParsed.error_description })
            }
            if (googleResponseParsed.email !== "cloudscheduler-web-app@bonout-9dc18.iam.gserviceaccount.com") {
                return res.status(400).json({ error: "you do not have the authorization to access this ressource" })
            }
            await deletePastEvents().then(() => res.status(200).json({ message: "event deleted" }));
        } else {
            return res.status(405).json({ error: "method not allowed" })
        }
    } catch (err: any) {
        if (err instanceof RequestError) {
            return res.status(400).json({ error: err.message });
        } else {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    function isDeleteRequest(): boolean {
        return req.method === "DELETE";
    }
}
