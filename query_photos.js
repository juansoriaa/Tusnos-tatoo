import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

const firebaseConfig = {
  projectId: "commanding-bond-v5xj8",
  appId: "1:214854191012:web:f5878668b1be2e541e6331",
  apiKey: "AIzaSyDf-sottrGY7avrz9vSanPerxo1SR0CB3A",
  authDomain: "commanding-bond-v5xj8.firebaseapp.com",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-e02f872d-9aaa-41a2-8b00-28bd5eb4d807");

async function run() {
  const q = query(collection(db, "photos"), where("createdBy", "==", "0e423bec-0432-4f20-8824-8fb4bf5d6dc0"));
  const snap = await getDocs(q);
  console.log(`Found ${snap.size} photos in Firestore.`);
  const photos = [];
  snap.forEach(d => photos.push(d.data()));
  console.log(JSON.stringify(photos, null, 2));
  process.exit(0);
}
run();
