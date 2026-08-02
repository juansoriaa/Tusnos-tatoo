const fs = require('fs');
let content = fs.readFileSync('src/firebase.ts', 'utf-8');

// replace experimentalForceLongPolling with localCache
content = content.replace(
  "experimentalForceLongPolling: true",
  "experimentalForceLongPolling: true,\n    localCache: typeof window !== 'undefined' ? require('firebase/firestore').persistentLocalCache({tabManager: require('firebase/firestore').persistentMultipleTabManager()}) : undefined"
);

fs.writeFileSync('src/firebase.ts', content);
console.log("Patched firebase.ts");
