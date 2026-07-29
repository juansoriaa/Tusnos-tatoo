const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

code = code.replace(
    /import \{ db, auth, onAuthStateChanged \} from '\.\.\/firebase';/,
    `import { db, auth, onAuthStateChanged } from '../firebase';
import { preloadDashboardData } from '../lib/dashboardPreloader';`
);

code = code.replace(
    /if \(localUid\) \{\s*setAuthUid\(localUid\);\s*setIsAuthChecking\(false\);\s*\} else \{/,
    `if (localUid) {
            setAuthUid(localUid);
            setIsAuthChecking(false);
            preloadDashboardData(localUid);
        } else {`
);

code = code.replace(
    /if \(user\) \{\s*setAuthUid\(user\.uid\);\s*setIsAuthChecking\(false\);\s*\} else \{/,
    `if (user) {
                    setAuthUid(user.uid);
                    setIsAuthChecking(false);
                    preloadDashboardData(user.uid);
                } else {`
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
