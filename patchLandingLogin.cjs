const fs = require('fs');
let landing = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const search = "const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);";
const replacement = `const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
          
          const uid = userCredential.user.uid;
          const userRef = doc(db, 'users', uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
              await setDoc(userRef, {
                  email: loginEmail,
                  userTag: loginEmail.split('@')[0],
                  displayName: 'Nuevo Artista',
                  isAvailable: true,
                  createdAt: serverTimestamp(),
                  bio: 'Perfil recién creado. Edita este texto desde tu Panel de Control.'
              });
          }`;

if (landing.includes(search)) {
    landing = landing.replace(search, replacement);
    fs.writeFileSync('src/components/Landing.tsx', landing);
    console.log("Landing patched successfully.");
} else {
    console.log("Not found.");
}
