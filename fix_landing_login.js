import fs from 'fs';
let code = fs.readFileSync('src/components/Landing.tsx', 'utf8');

// replace dynamic import in handleEmailLogin
const target = `      const { collection, query, where, getDocs, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      
      let loginEmail = trimEmail;`;
const rep = `      let loginEmail = trimEmail;`;
code = code.replace(target, rep);

// make sure setDoc and serverTimestamp are statically imported
code = code.replace(
  `import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';`,
  `import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, setDoc, serverTimestamp } from 'firebase/firestore';`
);

fs.writeFileSync('src/components/Landing.tsx', code);
