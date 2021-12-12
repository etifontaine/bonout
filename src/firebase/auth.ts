import admin from "@src/firebase/admin";
import logger from "@src/logger";

interface iResponse {
  message: string;
  error: boolean;
}

export async function checkFirebaseAuth(token: string): Promise<iResponse> {
  if (!token) {
    return { message: "token not provided", error: true };
  }

  const verifyAppCheckToken = async (appCheckToken: string) => {
    try {
      return admin.appCheck().verifyToken(appCheckToken);
    } catch (err) {
      logger.error(err);
      return { message: "token not valid", error: true };
    }
  };
  const appCheckClaims = await verifyAppCheckToken(token);
  if (!appCheckClaims) {
    return { message: "no claims with token", error: true };
  }
  return { message: "token valid", error: false };
}
