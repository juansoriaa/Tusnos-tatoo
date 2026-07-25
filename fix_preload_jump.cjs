const fs = require('fs');

let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const target = `            </>
          ) : (
            <>`;

const replacement = `            </>
          ) : (
            <>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/Preload.tsx', content);
