const fs = require('fs');
let code = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

code = code.replace(
    /const q = query\(collection\(db, 'users', targetUserId, 'waitlist'\), orderBy\('createdAt', 'desc'\)\);/,
    `const q = query(collection(db, 'users', targetUserId, 'waitlist'));`
);

code = code.replace(
    /const messages = snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\);/,
    `let messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    messages.sort((a, b) => {
                        const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.time || 0).getTime();
                        const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.time || 0).getTime();
                        return dateB - dateA;
                    });`
);

fs.writeFileSync('src/components/DemoWaitlist.tsx', code);
