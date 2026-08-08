import fs from 'fs';
let cssCode = fs.readFileSync('src/index.css', 'utf8');

cssCode = cssCode.replace(
  /stroke-width: 1\.5px !important; \/\* to make them thin\/clean \*\//g,
  'font-variation-settings: \\\'FILL\\\' 0, \\\'wght\\\' 200, \\\'GRAD\\\' 0, \\\'opsz\\\' 24 !important; /* thin clean icon */'
);

fs.writeFileSync('src/index.css', cssCode);
