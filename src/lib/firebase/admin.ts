// lib/firebase/admin.ts
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const apps = getApps();

if (!apps.length) {
  if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
      }),
    });
  } else {
    // Use default app initialization (relies on GOOGLE_APPLICATION_CREDENTIALS or other defaults)
    initializeApp();
  }
}

const adminDb = getFirestore();

export { adminDb };
