const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

// replace the load function
code = code.replace(
    /const load = async \(\) => \{[\s\S]*?unsubscribe = onSnapshot\(q, \(snapshot\) => \{[\s\S]*?setWaitlistCount\(snapshot\.docs\.length\);[\s\S]*?\}\);[\s\S]*?\}[\s\S]*?\};/,
    `const load = async () => {
            const demoUserId = authUid || localStorage.getItem('demoUserId');
            if (demoUserId) {
                const { collection, onSnapshot, query, where, doc, getDoc } = await import('firebase/firestore');
                
                getDoc(doc(db, 'users', demoUserId)).then(userDoc => {
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setTurnosLlenos(data.isAvailable === false);
                        if (data.profilePhotoUrl) setAvatarUrl(data.profilePhotoUrl);
                    }
                }).catch(e => console.error(e));

                const q = query(collection(db, 'users', demoUserId, 'waitlist'), where('read', '==', false));
                unsubscribe = onSnapshot(q, (snapshot) => {
                    setWaitlistCount(snapshot.docs.length);
                });
            }
        };`
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
