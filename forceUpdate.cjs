const fs = require('fs');

// 1. Fix state initialization in DemoDashboard.tsx
let dashboard = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

dashboard = dashboard.replace(
    /const \[avatarUrl, setAvatarUrl\] = useState\(defaultAvatar\);/,
    `const [avatarUrl, setAvatarUrl] = useState(initDataCache.profilePhotoUrl || defaultAvatar);`
);

dashboard = dashboard.replace(
    /const \[bannerUrl, setBannerUrl\] = useState\(defaultBanner\);/,
    `const [bannerUrl, setBannerUrl] = useState((initDataCache.backgroundPhotos && initDataCache.backgroundPhotos.length > 0) ? initDataCache.backgroundPhotos[0] : defaultBanner);`
);

// 2. Add cache buster to PWA manifest
dashboard = dashboard.replace(
    /start_url: window\.location\.pathname,/,
    `start_url: window.location.pathname + '?v=' + Date.now(),`
);

fs.writeFileSync('src/components/DemoDashboard.tsx', dashboard);

// 3. Add auto-updater logic in main.tsx
let main = fs.readFileSync('src/main.tsx', 'utf8');

main = main.replace(
    /if \('serviceWorker' in navigator\) \{/,
    `
window.forceClearCache = async () => {
    if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
    }
    if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (let reg of regs) {
            await reg.unregister();
        }
    }
    localStorage.clear();
    window.location.href = window.location.pathname + '?nocache=' + Date.now();
};

if ('serviceWorker' in navigator) {`
);

fs.writeFileSync('src/main.tsx', main);

console.log('Applied cache busting and state fixes');
