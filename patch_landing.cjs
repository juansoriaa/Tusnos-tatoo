const fs = require('fs');

let content = fs.readFileSync('src/components/Landing.tsx', 'utf-8');

const loginBlockOld = `    try {
      const { collection, query, where, getDocs, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      
      if (isRegister) {
          if (!trimEmail.includes('@')) {
              trimEmail = trimEmail + '@demo.com';
          }
          
          const qEmail = query(collection(db, 'users'), where('email', '==', trimEmail));
          const snapEmail = await getDocs(qEmail);
          
          if (!snapEmail.empty) {
              setLoginError('El correo o usuario ya está en uso.');
              setIsLoggingIn(false);
              return;
          }
          
          const userUid = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
          let baseName = trimEmail.split('@')[0];
          
          await setDoc(doc(db, 'users', userUid), {
              uid: userUid,
              email: trimEmail,
              userTag: '@' + baseName,
              displayName: baseName,
              specialtyTags: ['Tatuador'],
              createdAt: serverTimestamp(),
              bio: 'Bienvenido a mi portafolio.',
              location: 'Mi Estudio',
              experience: 'Nuevo',
              customPassword: trimPass
          });
          
          localStorage.setItem('demoUserId', userUid);
          
          setIsLoggingIn(false);
          setShowLoginModal(false);
          setEmail('');
          setPassword('');
          navigate('/demo/dashboard');
          return;
      } else {
          let loginEmail = trimEmail;
          let userDoc = null;
          
          if (!loginEmail.includes('@')) {
              let tag = loginEmail;
              if (!tag.startsWith('@')) tag = '@' + tag;
              
              const qTag = query(collection(db, 'users'), where('userTag', '==', tag));
              const snapTag = await getDocs(qTag);
              if (!snapTag.empty) {
                  userDoc = snapTag.docs[0];
                  loginEmail = userDoc.data().email;
              } else {
                  loginEmail = loginEmail + '@demo.com';
              }
          }
          
          if (!userDoc) {
              const qEmail = query(collection(db, 'users'), where('email', '==', loginEmail));
              const snapEmail = await getDocs(qEmail);
              if (!snapEmail.empty) {
                  userDoc = snapEmail.docs[0];
              }
          }
          
          if (userDoc) {
              const data = userDoc.data();
              if (data.customPassword === trimPass || trimPass === '123456' || trimPass === 'demo') {
                  localStorage.setItem('demoUserId', userDoc.id);
                  setIsLoggingIn(false);
                  setShowLoginModal(false);
                  setEmail('');
                  setPassword('');
                  navigate('/demo/dashboard');
                  return;
              } else {
                  setLoginError('Credenciales incorrectas.');
                  setIsLoggingIn(false);
                  return;
              }
          } else {
              if (loginEmail.endsWith('@demo.com') && (trimPass === '123456' || trimPass === 'demo')) {
                  const userUid = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
                  let baseName = loginEmail.split('@')[0];
                  
                  await setDoc(doc(db, 'users', userUid), {
                      uid: userUid,
                      email: loginEmail,
                      userTag: '@' + baseName,
                      displayName: baseName,
                      specialtyTags: ['Tatuador', 'Fine Line', 'Geométrico'],
                      customPassword: trimPass,
                      createdAt: serverTimestamp(),
                      bio: 'Bienvenido a mi portafolio.',
                      location: 'Mi Estudio',
                      experience: 'Nuevo'
                  });
                  localStorage.setItem('demoUserId', userUid);
                  
                  setIsLoggingIn(false);
                  setShowLoginModal(false);
                  setEmail('');
                  setPassword('');
                  navigate('/demo/dashboard');
                  return;
              } else {
                  setLoginError('Usuario no encontrado.');
                  setIsLoggingIn(false);
                  return;
              }
          }
      }
    } catch (error: any) {
      console.error("Login failed", error);
      setIsLoggingIn(false);
      setLoginError(isRegister ? 'Error al registrarse.' : 'Error inesperado.');
    }`;

const loginBlockNew = `    try {
      const { collection, query, where, getDocs, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      
      let loginEmail = trimEmail;
      let userDoc = null;
      
      if (!loginEmail.includes('@')) {
          let tag = loginEmail;
          if (!tag.startsWith('@')) tag = '@' + tag;
          
          const qTag = query(collection(db, 'users'), where('userTag', '==', tag));
          const snapTag = await getDocs(qTag);
          if (!snapTag.empty) {
              userDoc = snapTag.docs[0];
              loginEmail = userDoc.data().email;
          } else {
              loginEmail = loginEmail + '@demo.com';
          }
      }
      
      if (!userDoc) {
          const qEmail = query(collection(db, 'users'), where('email', '==', loginEmail));
          const snapEmail = await getDocs(qEmail);
          if (!snapEmail.empty) {
              userDoc = snapEmail.docs[0];
          }
      }
      
      if (userDoc) {
          const data = userDoc.data();
          if (data.customPassword === trimPass || trimPass === '123456' || trimPass === 'demo') {
              localStorage.setItem('demoUserId', userDoc.id);
              setIsLoggingIn(false);
              setShowLoginModal(false);
              setEmail('');
              setPassword('');
              navigate('/demo/dashboard');
              return;
          } else {
              setLoginError('Credenciales incorrectas.');
              setIsLoggingIn(false);
              return;
          }
      } else {
          setLoginError('Usuario no encontrado. Solo un superadmin puede crear cuentas.');
          setIsLoggingIn(false);
          return;
      }
    } catch (error: any) {
      console.error("Login failed", error);
      setIsLoggingIn(false);
      setLoginError('Error inesperado.');
    }`;

content = content.replace(loginBlockOld, loginBlockNew);

// Replace button onclicks:
content = content.replace(
  `onClick={() => { if(user) navigate('/demo/dashboard'); else { setIsRegister(true); setShowLoginModal(true); } }}`,
  `onClick={() => { if(user) navigate('/demo/dashboard'); else setContactModalOpen(true); }}`
);
content = content.replace(
  `onClick={() => { setIsRegister(true); setShowLoginModal(true); }}`,
  `onClick={() => setContactModalOpen(true)}`
);
content = content.replace(
  `onClick={() => { setIsRegister(true); setShowLoginModal(true); }}`,
  `onClick={() => setContactModalOpen(true)}`
);

// Remove isRegister usages
content = content.replace(
  `const [isRegister, setIsRegister] = useState(false);`,
  ``
);
content = content.replace(
  `setIsRegister(false);`,
  ``
);

fs.writeFileSync('src/components/Landing.tsx', content);
