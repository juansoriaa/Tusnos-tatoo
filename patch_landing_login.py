import re

with open('src/components/Landing.tsx', 'r') as f:
    content = f.read()

# Make sure query, where, getDocs, collection are imported
if "query" not in content:
    content = content.replace("import { doc, getDoc } from 'firebase/firestore';", "import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';")

old_try_catch = r"    try \{\n      await signInWithEmailAndPassword\(auth, trimEmail, password\);\n      setShowLoginModal\(false\);\n      setEmail\(''\);\n      setPassword\(''\);\n      navigate\('/demo/profile'\); // Or wherever they should go after login\n    \} catch \(error: any\) \{\n      console.error\(\"Login failed\", error\);\n      setLoginError\('Credenciales incorrectas o error en el inicio de sesión.'\);\n    \}"

new_try_catch = """    try {
      await signInWithEmailAndPassword(auth, trimEmail, password);
      setShowLoginModal(false);
      setEmail('');
      setPassword('');
      navigate('/demo/profile'); 
    } catch (error: any) {
      try {
        // Fallback para login de demo con Firestore
        let userDoc = null;
        const usersRef = collection(db, 'users');
        const qEmail = query(usersRef, where('email', '==', trimEmail));
        const snapEmail = await getDocs(qEmail);
        
        if (!snapEmail.empty) {
            userDoc = snapEmail.docs[0];
        } else {
            let tag = trimEmail;
            if (!tag.startsWith('@')) tag = '@' + tag;
            const qTag = query(usersRef, where('userTag', '==', tag));
            const snapTag = await getDocs(qTag);
            if (!snapTag.empty) {
                userDoc = snapTag.docs[0];
            }
        }

        if (userDoc) {
            const userData = userDoc.data();
            const storedPassword = userData.customPassword || '123456';
            if (storedPassword === trimPass) {
                localStorage.setItem('demoUserId', userData.uid);
                setShowLoginModal(false);
                setEmail('');
                setPassword('');
                navigate('/demo/dashboard');
                return;
            }
        }
      } catch (dbErr) {
        console.error("Firestore check failed", dbErr);
      }

      console.error("Login failed", error);
      setLoginError('Credenciales incorrectas o error en el inicio de sesión.');
    }"""

content = re.sub(old_try_catch, new_try_catch, content)

with open('src/components/Landing.tsx', 'w') as f:
    f.write(content)

