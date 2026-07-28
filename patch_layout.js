const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

code = code.replace(/const handleNav = \(path: string\) => \{/g, `const handleNav = (path: string) => {
        if (path.startsWith('/demo/') && path !== '/demo/profile' && currentUserTag) {
            const utag = currentUserTag.startsWith('@') ? currentUserTag : '@' + currentUserTag;
            path = path.replace('/demo/', '/' + utag + '/');
        }
`);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
