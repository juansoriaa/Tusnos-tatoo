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
  const q = collection(db, "users");
  const snap = await getDocs(q);
  const users = [];
  snap.forEach(doc => {
    const data = doc.data();
    if (data.userTag && data.userTag.toLowerCase().includes("dani")) {
        users.push({ id: doc.id, tag: data.userTag, displayName: data.displayName, email: data.email, theme: data.theme });
    }
  });
  console.log("Found users:");
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}
run();
