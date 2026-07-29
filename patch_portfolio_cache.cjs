const fs = require('fs');
let code = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// Add a useEffect to sync existingPhotos to localStorage and globalPreloadCache
if (!code.includes('demoAllTattoos_')) {
    code = code.replace(
        /const \[existingPhotos, setExistingPhotos\] = useState<any\[\]>\(\[\]\);/,
        `const [existingPhotos, setExistingPhotos] = useState<any[]>([]);
    
    useEffect(() => {
        if (existingPhotos.length > 0) {
            const uid = (localStorage.getItem('demoUserId') || auth.currentUser?.uid) || 'demo';
            localStorage.setItem('demoAllTattoos_' + uid, JSON.stringify(existingPhotos));
            import('../lib/cache').then(({ globalPreloadCache }) => {
                globalPreloadCache[uid] = { ...globalPreloadCache[uid], allTattoos: existingPhotos };
            });
        }
    }, [existingPhotos]);`
    );
    fs.writeFileSync('src/components/DemoPortfolio.tsx', code);
}
