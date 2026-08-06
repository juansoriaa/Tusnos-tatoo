import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
    projectId: "ai-studio-e02f872d-9aaa-41a2-8b00-28bd5eb4d807"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
    console.log("Fetching photos...");
    try {
        const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'), limit(12));
        const snapshot = await getDocs(q);
        console.log("Count with orderBy:", snapshot.size);
    } catch(e) {
        console.error("Error with orderBy:", e.message);
    }
    
    try {
        const q2 = query(collection(db, 'photos'), limit(12));
        const snapshot2 = await getDocs(q2);
        console.log("Count without orderBy:", snapshot2.size);
    } catch(e) {
        console.error("Error without orderBy:", e.message);
    }
    process.exit(0);
}
check();
