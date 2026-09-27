const fs = require('fs');

function patchDemoLayout() {
    let layout = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');
    
    const search = `                  // Real-time listener for user data (crucial for Top Nav avatar and theme sync)
                  unsubscribeUser = onSnapshot(doc(db, 'users', demoUserId), (userDoc) => {
                      if (userDoc.exists()) {
                          const data = userDoc.data();`;
                          
    const replacement = `                  // Real-time listener for user data (crucial for Top Nav avatar and theme sync)
                  unsubscribeUser = onSnapshot(doc(db, 'users', demoUserId), async (userDoc) => {
                      if (userDoc.exists()) {
                          const data = userDoc.data();`;

    if (layout.includes(search)) {
        layout = layout.replace(search, replacement);
    }
    
    const search2 = `                          if (data.theme) setTheme(data.theme);
                          localStorage.setItem('demoArtistData_' + demoUserId, JSON.stringify(data));
                      }
                  }, (error) => console.error("Error en onSnapshot de DemoLayout", error));`;
                  
    const replacement2 = `                          if (data.theme) setTheme(data.theme);
                          localStorage.setItem('demoArtistData_' + demoUserId, JSON.stringify(data));
                      } else {
                          // Auto-create document if missing
                          try {
                              const { setDoc, serverTimestamp } = await import('firebase/firestore');
                              await setDoc(doc(db, 'users', demoUserId), {
                                  userTag: 'nuevo_artista_' + Math.floor(Math.random() * 1000),
                                  displayName: 'Nuevo Artista',
                                  isAvailable: true,
                                  createdAt: serverTimestamp(),
                                  bio: 'Perfil recién creado.'
                              });
                          } catch(e) { console.error("Error auto-creating user", e); }
                      }
                  }, (error) => console.error("Error en onSnapshot de DemoLayout", error));`;

    if (layout.includes(search2)) {
        layout = layout.replace(search2, replacement2);
        fs.writeFileSync('src/components/DemoLayout.tsx', layout);
        console.log("DemoLayout patched successfully.");
    } else {
        console.log("Could not find search2 in DemoLayout.");
    }
}

patchDemoLayout();
