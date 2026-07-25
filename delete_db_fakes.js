import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "commanding-bond-v5xj8",
  appId: "1:214854191012:web:f5878668b1be2e541e6331",
  apiKey: "AIzaSyDf-sottrGY7avrz9vSanPerxo1SR0CB3A",
  authDomain: "commanding-bond-v5xj8.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-e02f872d-9aaa-41a2-8b00-28bd5eb4d807");

const fakes = ['demo@turnostattoo.com', 'jaxxon@ink.com', 'vera@ink.com', 'max@ink.com', 'elias@ink.com'];

async function deleteFakes() {
  const usersRef = collection(db, 'users');
  const snap = await getDocs(usersRef);
  for (const document of snap.docs) {
    if (fakes.includes(document.data().email)) {
      console.log('Deleting', document.data().email);
      await deleteDoc(doc(db, 'users', document.id));
    }
  }
  console.log('Done');
  process.exit(0);
}

deleteFakes();
