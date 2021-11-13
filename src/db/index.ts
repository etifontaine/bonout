import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert('bonout-web-app-sa.json'),
            databaseURL: "YOUR_DB_URL"
        });
    } catch (error) {
        console.log('Firebase admin initialization error', error);
    }
}

export default admin.firestore();
