import logger from "@src/logger";
import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    if (process.env.DB_ENV === "production" || process.env.DB_ENV === "staging") {
      admin.initializeApp({
        serviceAccountId: process.env.SA_ID,
      });
    } else if (process.env.DB_ENV === "build") {
      admin.initializeApp();
    } else {
      admin.initializeApp({
        credential: admin.credential.cert("bonout-web-app-sa.json"),
      });
    }
  } catch (error) {
    logger.error({"message": "Firebase admin initialization error", error});
  }
}

export default admin.firestore();
