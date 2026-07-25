const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const oldEffect = `    useEffect(() => {
        // Fetch existing photos when component mounts
    const fetchPhotos = async () => {`;

const newEffect = `    useEffect(() => {
        // Fetch existing photos when component mounts
    const fetchPhotos = async (userUid: string) => {`;

content = content.replace(oldEffect, newEffect);

const oldUidLine = `let artistUid = auth.currentUser?.uid || 'anonymous_demo';`;
const newUidLine = `let artistUid = userUid || 'anonymous_demo';`;

content = content.replace(oldUidLine, newUidLine);

const oldFetchCall = `        };
        fetchPhotos();
    }, []);`;

const newFetchCall = `        };
        const unsubscribe = auth.onAuthStateChanged((user) => {
            fetchPhotos(user?.uid || '');
        });
        return () => unsubscribe();
    }, []);`;

content = content.replace(oldFetchCall, newFetchCall);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
