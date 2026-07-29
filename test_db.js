import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "ai-studio-e02f872d-9aaa-41a2-8b00-28bd5eb4d807",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    const docRef = doc(db, 'config', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(JSON.stringify(docSnap.data().landingImages, null, 2));
    } else {
      console.log("No config found");
    }
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();
