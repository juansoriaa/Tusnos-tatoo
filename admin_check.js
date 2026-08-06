import admin from 'firebase-admin';

admin.initializeApp({
  projectId: "ai-studio-e02f872d-9aaa-41a2-8b00-28bd5eb4d807"
});

const db = admin.firestore();
async function check() {
  const snapshot = await db.collection('photos').orderBy('createdAt', 'desc').limit(12).get();
  console.log("Photos found:", snapshot.size);
  snapshot.forEach(doc => console.log(doc.id, doc.data().src, doc.data().url, doc.data().imageUrl));
  
  if (snapshot.size === 0) {
      const snap2 = await db.collection('photos').limit(12).get();
      console.log("Photos without orderby:", snap2.size);
  }
}
check();
