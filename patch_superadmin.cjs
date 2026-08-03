const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf-8');

content = content.replace(
    /whatsapp: newUserData.whatsapp,/,
    `whatsapp: newUserData.whatsapp,
        customPassword: '123456',`
);

fs.writeFileSync('src/components/SuperAdmin.tsx', content);
console.log("Patched SuperAdmin successfully!");
