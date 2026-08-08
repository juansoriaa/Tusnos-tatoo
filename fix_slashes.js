import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/\\'/g, "'");
fs.writeFileSync('src/index.css', css);
