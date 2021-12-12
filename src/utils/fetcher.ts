import app from "@src/firebase/client";
import logger from "@src/logger";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken,
} from "firebase/app-check";
import { isClientSide } from "./client";

export default async function fetcher(
  path: string,
  method: string,
  body?: string
): Promise<Response> {
  // self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  const captchaKey = process.env.NEXT_PUBLIC_FIREBASE_CAPTCHA;
  if (!captchaKey) {
    logger.error("no firebase captcha");
    throw Error("no firebase captcha");
  }
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(captchaKey),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true,
  });
  let appCheckTokenResponse;
  try {
    appCheckTokenResponse = await getToken(appCheck, /* forceRefresh= */ false);
  } catch (err) {
    // Handle any errors if the token was not retrieved.
    console.log(err);
  }
  if (!appCheckTokenResponse) {
    throw Error("no appCheck token response");
  }
  return fetch(path, {
    method,
    body,
    headers: {
      "X-Firebase-AppCheck": appCheckTokenResponse.token,
    },
  });
}