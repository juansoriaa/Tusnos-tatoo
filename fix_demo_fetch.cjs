const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const oldFetchPhotos = `    const fetchPhotos = async () => {
            if (!auth.currentUser) return;
            try {
                const q = query(
                    collection(db, 'photos'),
                    where('createdBy', '==', auth.currentUser.uid),
                    orderBy('createdAt', 'desc')
                );`;

const newFetchPhotos = `    const fetchPhotos = async () => {
            let artistUid = auth.currentUser?.uid || 'anonymous_demo';
            try {
                const q = query(
                    collection(db, 'photos'),
                    where('createdBy', '==', artistUid),
                    orderBy('createdAt', 'desc')
                );`;

content = content.replace(oldFetchPhotos, newFetchPhotos);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
