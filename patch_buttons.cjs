const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

// replace `<button className=` with `<button type="button" className=`
// but only inside the modal
content = content.replace(/<button \n/g, '<button type="button"\n');
content = content.replace(/<button className/g, '<button type="button" className');

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched buttons successfully!");
