const fs = require('fs');
let code = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

code = code.replace(
    /let messages = snapshot\.docs\.map\(doc => \(\{ id: doc\.id, \.\.\.doc\.data\(\) \}\)\);/,
    `let messages = snapshot.docs.map(doc => ({ ...doc.data(), id: String(doc.id) }));`
);

// Also fix doc() call to force string just in case
code = code.replace(
    /updateDoc\(doc\(db, 'users', targetId, 'waitlist', data\.id\)/g,
    `updateDoc(doc(db, 'users', targetId, 'waitlist', String(data.id))`
);

fs.writeFileSync('src/components/DemoWaitlist.tsx', code);
