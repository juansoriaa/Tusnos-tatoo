import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, initializeFirestore, setLogLevel, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "commanding-bond-v5xj8",
  appId: "1:214854191012:web:f5878668b1be2e541e6331",
  apiKey: "AIzaSyDf-sottrGY7avrz9vSanPerxo1SR0CB3A",
  authDomain: "commanding-bond-v5xj8.firebaseapp.com",
  storageBucket: "commanding-bond-v5xj8.firebasestorage.app",
  messagingSenderId: "214854191012",
  measurementId: "",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// setLogLevel('debug');

let _authInstance: any = null;
export const getFirebaseAuth = () => {
  if (!_authInstance) {
    _authInstance = getAuth(app);
  }
  return _authInstance;
};

export const auth = new Proxy({} as any, {
  get(_target, prop) {
    const instance = getFirebaseAuth();
    const value = instance[prop];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});

let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
        localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
  }, "ai-studio-e02f872d-9aaa-41a2-8b00-28bd5eb4d807");
} catch (e) {
  firestoreDb = getFirestore(app, "ai-studio-e02f872d-9aaa-41a2-8b00-28bd5eb4d807");
}

export const db = firestoreDb;

let _storageInstance: any = null;
export const storage = new Proxy({} as any, {
  get(_target, prop) {
    if (!_storageInstance) {
      _storageInstance = getStorage(app);
    }
    const value = _storageInstance[prop];
    if (typeof value === 'function') {
      return value.bind(_storageInstance);
    }
    return value;
  }
});

export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged };
