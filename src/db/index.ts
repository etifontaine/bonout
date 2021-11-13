import admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        if (process.env.DB_ENV === 'production') {
            admin.initializeApp({
                serviceAccountId: process.env.SA_ID
            })
        } else {
            admin.initializeApp({
                credential: admin.credential.cert('bonout-web-app-sa.json'),
            });
        }
    } catch (error) {
        console.log('Firebase admin initialization error', error);
    }
}

export default admin.firestore();
