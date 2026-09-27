const fs = require('fs');
let file = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');
file = file.replace("import('firebase/firestore').then(({ collection, onSnapshot, query }) => {", "import('firebase/firestore').then(({ collection, onSnapshot, query, orderBy, limit }) => {");
fs.writeFileSync('src/components/DemoWaitlist.tsx', file);
