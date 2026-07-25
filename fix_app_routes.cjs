const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        <Route path="/demo/preload" element={<Preload />} />`;

const replacement = `        <Route path="/demo/preload" element={<Preload />} />
        <Route path="/demo/preload/:id" element={<Preload />} />`;

content = content.replace(target, replacement);

fs.writeFileSync('src/App.tsx', content);
