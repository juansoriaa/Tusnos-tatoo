import fs from 'fs';
let code = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const targetSort = `          // Local sort if we didn't use the ordered query (i.e. size is likely > 12 if no limit was applied)
          if (works.length > 12) {
              works.sort((a, b) => {
                  const timeA = a.createdAt?.toMillis?.() || a.createdAt || 0;
                  const timeB = b.createdAt?.toMillis?.() || b.createdAt || 0;
                  return timeB - timeA;
              });
              works = works.slice(0, 12);
          }`;

const replaceSort = `          // Local sort unconditionally just to be safe if fallback was used
          works.sort((a, b) => {
              const timeA = a.createdAt?.toMillis?.() || a.createdAt || 0;
              const timeB = b.createdAt?.toMillis?.() || b.createdAt || 0;
              return timeB - timeA;
          });
          works = works.slice(0, 12);`;

code = code.replace(targetSort, replaceSort);
fs.writeFileSync('src/components/Landing.tsx', code);
