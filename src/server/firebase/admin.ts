import admin from "firebase-admin";

const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

if (!bucketName) {
  throw new Error("FIREBASE_STORAGE_BUCKET missing");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: bucketName,
  });
}

/**
 * IMPORTANT: bucket explicite = zéro bug
 */
export const bucket = admin.storage().bucket(bucketName);

export const db = admin.firestore();
export const auth = admin.auth();