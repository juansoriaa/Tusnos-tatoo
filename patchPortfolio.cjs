const fs = require('fs');
let file = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');
file = file.replace("import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';", "import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where, doc, updateDoc, deleteDoc, writeBatch, limit } from 'firebase/firestore';");
fs.writeFileSync('src/components/DemoPortfolio.tsx', file);
