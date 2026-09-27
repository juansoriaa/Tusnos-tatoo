const fs = require('fs');

let layout = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

const search = "import { doc, getDoc, updateDoc, collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';";
const replacement = "import { doc, getDoc, updateDoc, collection, query, orderBy, onSnapshot, where, limit } from 'firebase/firestore';";

if (layout.includes(search)) {
    layout = layout.replace(search, replacement);
    fs.writeFileSync('src/components/DemoLayout.tsx', layout);
    console.log("Import patched!");
} else {
    console.log("Could not find the exact import string.");
}
