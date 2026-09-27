const fs = require('fs');

let layout = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

const regexUserStart = /unsubscribeUser = onSnapshot\(doc\(db, 'users', demoUserId\), \(userDoc\) => \{/g;
layout = layout.replace(regexUserStart, "unsubscribeUser = onSnapshot(doc(db, 'users', demoUserId), async (userDoc) => {");

const regexUserEnd = /localStorage\.setItem\('demoArtistData_' \+ demoUserId, JSON\.stringify\(data\)\);\s*\r?\n\s*\}\s*\r?\n\s*\}, \(error\)/g;
const replaceEnd = `localStorage.setItem('demoArtistData_' + demoUserId, JSON.stringify(data));
                      } else {
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
                  }, (error)`;

layout = layout.replace(regexUserEnd, replaceEnd);

fs.writeFileSync('src/components/DemoLayout.tsx', layout);
console.log("Patched DemoLayout.");
