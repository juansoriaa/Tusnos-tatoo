const fs = require('fs');
let code = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

code = code.replace(
    /import \{ useNavigate \} from 'react-router-dom';/,
    `import { useNavigate, useParams } from 'react-router-dom';`
);

code = code.replace(
    /export default function DemoWaitlist\(\) \{/,
    `export default function DemoWaitlist() {
    const { id } = useParams();`
);

code = code.replace(
    /const demoUserId = auth\.currentUser\?\.uid;/,
    `const demoUserId = id || localStorage.getItem('demoUserId') || auth.currentUser?.uid || 'demo';`
);

fs.writeFileSync('src/components/DemoWaitlist.tsx', code);
