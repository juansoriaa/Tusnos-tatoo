const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

code = code.replace(
    /auth\.signOut\(\)\); navigate\('\/'\);/,
    `auth.signOut()); navigate('/?login=true');`
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
