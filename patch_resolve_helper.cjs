const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /const \{ id \} = useParams\(\);/,
    `const { id } = useParams();
  
  const resolveTargetId = () => {
        let targetId = id || localStorage.getItem('demoUserId') || 'demo';
        if (id && id.startsWith('@')) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('demoArtistData_')) {
                    try {
                        const cached = JSON.parse(localStorage.getItem(key) || '{}');
                        if (cached.userTag === id || cached.userTag === '@' + id || '@' + cached.userTag === id) {
                            targetId = cached.uid || key.replace('demoArtistData_', '');
                            break;
                        }
                    } catch(e) {}
                }
            }
        }
        return targetId;
  };`
);

code = code.replace(/const targetId = id \|\| localStorage\.getItem\('demoUserId'\) \|\| 'demo';/g, 'const targetId = resolveTargetId();');
code = code.replace(/let targetId = id \|\| localStorage\.getItem\('demoUserId'\) \|\| auth\.currentUser\?\.uid \|\| 'demo';[\s\S]*?return targetId;\s*\};/g, 'const targetId = resolveTargetId();');

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
