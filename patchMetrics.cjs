const fs = require('fs');
let file = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');
file = file.replace("import { collection, getDocs, query, orderBy, doc, getDoc, where } from 'firebase/firestore';", "import { collection, getDocs, query, orderBy, doc, getDoc, where, limit } from 'firebase/firestore';");
fs.writeFileSync('src/components/DemoMetrics.tsx', file);
