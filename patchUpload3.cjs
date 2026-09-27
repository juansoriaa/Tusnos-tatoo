const fs = require('fs');

let file = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// Replace the entire try-catch block for uploading in editing
const oldEditBlock = `                      // Upload to Firebase Storage
                      try {
                          if (!auth.currentUser && isRealUser) {
                              throw new Error('Tu sesin ha expirado. Por favor, cierra sesin y vuelve a entrar para subir fotos.');
                          }
                          if (auth.currentUser) {
                              const uid = auth.currentUser.uid;
                              const timestamp = Date.now();
                              
                              // Convert base64 to blob
                              
// Upload to ImgBB instead of Firebase Storage
const result = await uploadToImgBB(selectedFile);
photoDataUrl = result.url;
previewDataUrl = result.url; // ImgBB handles optimization
thumbDataUrl = result.thumbUrl;

                          }
                      } catch (err: any) {
                          console.error('Error uploading to storage:', err);
                          if (isRealUser) {
                              setErrorModalMsg(err.message || 'Error al subir la imagen. Por favor verifica tu conexin y sesin.');
                              setIsSaving(false);
                              return; // Prevent saving base64 to Firestore and breaking sync!
                          }
                          console.log('Falling back to base64 for demo user');
                      }`;

const newEditBlock = `                      try {
                          const result = await uploadToImgBB(selectedFile);
                          photoDataUrl = result.url;
                          previewDataUrl = result.url;
                          thumbDataUrl = result.thumbUrl;
                      } catch (err: any) {
                          console.error('Error uploading to ImgBB:', err);
                          if (isRealUser) {
                              setErrorModalMsg(err.message || 'Error al subir la imagen. Por favor intenta nuevamente.');
                              setIsSaving(false);
                              return;
                          }
                          console.log('Falling back to base64 for demo user');
                      }`;

// Replace the entire try-catch block for uploading in new photo
const oldNewBlock = `                  // Upload to Firebase Storage
                  let uploadFailed = false;
                  try {
                      if (!auth.currentUser && isRealUser) {
                          throw new Error('Tu sesin ha expirado. Por favor, cierra sesin y vuelve a entrar para subir fotos.');
                      }
                      if (auth.currentUser) {
                          const uid = auth.currentUser.uid;
                          const timestamp = Date.now();
                          
                          
// Upload to ImgBB instead of Firebase Storage
const result = await uploadToImgBB(selectedFile);
photoDataUrl = result.url;
previewDataUrl = result.url; // ImgBB handles optimization
thumbDataUrl = result.thumbUrl;

                      }
                  } catch (err: any) {
                      console.error('Error uploading to storage:', err);
                      if (isRealUser) {
                          setErrorModalMsg(err.message || 'Error al subir la imagen. Por favor verifica tu conexin y sesin.');
                          setIsSaving(false);
                          return; // Prevent saving base64 to Firestore and breaking sync!
                      }`;

const newNewBlock = `                  try {
                      const result = await uploadToImgBB(selectedFile);
                      photoDataUrl = result.url;
                      previewDataUrl = result.url;
                      thumbDataUrl = result.thumbUrl;
                  } catch (err: any) {
                      console.error('Error uploading to ImgBB:', err);
                      if (isRealUser) {
                          setErrorModalMsg(err.message || 'Error al subir la imagen. Por favor intenta nuevamente.');
                          setIsSaving(false);
                          return;
                      }`;

// We will use regex for safety since the exact encoding of 'sesión' might vary
file = file.replace(/\/\/ Upload to Firebase Storage[\s\S]*?Falling back to base64 for demo user'\);\s*\}/, newEditBlock);
file = file.replace(/\/\/ Upload to Firebase Storage[\s\S]*?return; \/\/ Prevent saving base64 to Firestore and breaking sync!\s*\}/, newNewBlock);


fs.writeFileSync('src/components/DemoPortfolio.tsx', file);
console.log('Patched try-catch blocks!');
