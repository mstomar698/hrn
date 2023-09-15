import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Persistence, browserSessionPersistence, getAuth, initializeAuth } from 'firebase/auth';
// Initialize Firebase
export interface ReactNativeAsyncStorage 
{
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
}
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

let app;
let auth;
export declare function getReactNativePersistence(storage: ReactNativeAsyncStorage): Persistence;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: browserSessionPersistence,
        popupRedirectResolver: undefined,
      });
} else {
    app  = getApp();
    auth = getAuth(app);
}
export const FIRESTORE_APP: any = app
export const FIRESTORE_DB: any = getFirestore(FIRESTORE_APP);
export const FIRESTORE_AUTH: any = auth
