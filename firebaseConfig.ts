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
    apiKey: "AIzaSyBqullHm3R7s2Zdu3v89dC_oqNUlNgekcE",
    authDomain: "native--auth-880fb.firebaseapp.com",
    projectId: "native--auth-880fb",
    storageBucket: "native--auth-880fb.appspot.com",
    messagingSenderId: "275075953582",
    appId: "1:275075953582:web:a8ff384e6bd245b55a8e3f"
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
