const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function run() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id}, Email: ${data.email}, UserTag: ${data.userTag}, Name: ${data.displayName}`);
  });
}

run().catch(console.error);
