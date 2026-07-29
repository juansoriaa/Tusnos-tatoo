const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/import Preload from "\.\/components\/Preload";/, '');
code = code.replace(/<Route path="\/demo\/preload" element={<Preload \/>} \/>/g, '');
code = code.replace(/<Route path="\/demo\/preload\/:id" element={<Preload \/>} \/>/g, '');
code = code.replace(/<Route path="\/:id\/preload" element={<Preload \/>} \/>/g, '');

fs.writeFileSync('src/App.tsx', code);
