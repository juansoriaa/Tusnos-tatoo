const fs = require('fs');

let content = fs.readFileSync('src/lib/dashboardPreloader.ts', 'utf-8');

const oldAppt = "const qAppt = query(collection(db, 'appointments'), where('artistId', '==', uid));";
const newAppt = "const qAppt = query(collection(db, 'users', uid, 'appointments'));";
content = content.replace(oldAppt, newAppt);

const oldWait = "const qWait = query(collection(db, 'waitlist'), where('artistId', '==', uid));";
const newWait = "const qWait = query(collection(db, 'users', uid, 'waitlist'));";
content = content.replace(oldWait, newWait);

fs.writeFileSync('src/lib/dashboardPreloader.ts', content);
