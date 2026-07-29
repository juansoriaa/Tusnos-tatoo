const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

code = code.replace(
    /import \{ preloadDashboardData \} from '\.\.\/lib\/dashboardPreloader';/,
    `import { preloadDashboardData, clearDashboardPreload } from '../lib/dashboardPreloader';`
);

code = code.replace(
    /if \(path === '\/'\) \{/,
    `if (path === '/') {
            clearDashboardPreload();`
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
