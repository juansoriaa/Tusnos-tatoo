import fs from 'fs';
let code = fs.readFileSync('src/firebase.ts', 'utf8');

code = code.replace(
  /experimentalForceLongPolling: true,\n/,
  ''
);

fs.writeFileSync('src/firebase.ts', code);
