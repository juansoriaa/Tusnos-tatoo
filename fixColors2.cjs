const fs = require('fs');

let file = fs.readFileSync('src/components/PhotoUploader.tsx', 'utf8');

file = file.replace(/#ffb4ab/g, '#054d44');

fs.writeFileSync('src/components/PhotoUploader.tsx', file);
console.log('Fixed pink color in PhotoUploader!');
