import fs from 'fs';
let code = fs.readFileSync('src/components/Landing.tsx', 'utf8');

code = code.replace(
  /for \(const uid of userIds\) \{/g,
  'for (const uid of userIds as string[]) {'
);

fs.writeFileSync('src/components/Landing.tsx', code);
