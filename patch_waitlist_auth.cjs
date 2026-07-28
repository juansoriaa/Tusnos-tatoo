const fs = require('fs');
let code = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

code = code.replace(
    /const \[waitlistMessages, setWaitlistMessages\] = useState<any\[\]>\(\[\]\);[\s\S]*?React\.useEffect\(\(\) => \{[\s\S]*?let unsubscribe = \(\) => \{\};[\s\S]*?const load = async \(\) => \{[\s\S]*?const \{ collection, onSnapshot, query, orderBy \} = await import\('firebase\/firestore'\);[\s\S]*?const demoUserId = id \|\| localStorage\.getItem\('demoUserId'\) \|\| auth\.currentUser\?\.uid \|\| 'demo';[\s\S]*?if \(demoUserId\) \{[\s\S]*?const q = query\(collection\(db, 'users', demoUserId, 'waitlist'\), orderBy\('createdAt', 'desc'\)\);[\s\S]*?unsubscribe = onSnapshot\(q, \(snapshot\) => \{[\s\S]*?const messages = snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\);[\s\S]*?setWaitlistMessages\(messages as any\);[\s\S]*?\}\);[\s\S]*?\}[\s\S]*?\};[\s\S]*?load\(\);[\s\S]*?return \(\) => unsubscribe\(\);[\s\S]*?\}, \[\]\);/,
    `const [waitlistMessages, setWaitlistMessages] = useState<any[]>([]);
    const [targetUserId, setTargetUserId] = useState<string | null>(null);

    React.useEffect(() => {
        let authUnsub = () => {};
        const localUid = id || localStorage.getItem('demoUserId');
        if (localUid) {
            setTargetUserId(localUid);
        } else {
            import('../firebase').then(({ auth, onAuthStateChanged }) => {
                authUnsub = onAuthStateChanged(auth, (user) => {
                    if (user) setTargetUserId(user.uid);
                    else setTargetUserId('demo');
                });
            });
        }
        return () => authUnsub();
    }, [id]);

    React.useEffect(() => {
        let unsubscribe = () => {};
        if (targetUserId) {
            const load = async () => {
                const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore');
                const q = query(collection(db, 'users', targetUserId, 'waitlist'), orderBy('createdAt', 'desc'));
                unsubscribe = onSnapshot(q, (snapshot) => {
                    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setWaitlistMessages(messages as any);
                });
            };
            load();
        }
        return () => unsubscribe();
    }, [targetUserId]);`
);

fs.writeFileSync('src/components/DemoWaitlist.tsx', code);
