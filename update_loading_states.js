import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target1 = `  const [isTattoosLoading, setIsTattoosLoading] = useState(() => {
        try {
            const targetId = resolveTargetId();
            if (globalPreloadCache[targetId]?.allTattoos) return false;
            if (localStorage.getItem('demoAllTattoos_' + targetId)) return false;
        } catch(e) {}
        return true;
    });`;

const replacement1 = `  const [isTattoosLoading, setIsTattoosLoading] = useState(() => {
        try {
            const targetId = resolveTargetId();
            if (globalPreloadCache[targetId]?.allTattoos) return false;
            if (localStorage.getItem('demoAllTattoos_' + targetId)) return false;
            if (targetId === '@victor_ink' || targetId === 'victor_ink' || targetId === 'demo' || targetId === '@demo' || targetId === 'anonymous_demo') return false;
        } catch(e) {}
        return true;
    });`;

const target2 = `  const [isProfileLoading, setIsProfileLoading] = useState(() => {
        try {
            const targetId = resolveTargetId();
            if (globalPreloadCache[targetId]?.artistData) return false;
            if (localStorage.getItem('demoArtistData_' + targetId)) return false;
        } catch(e) {}
        return true;
    });`;

const replacement2 = `  const [isProfileLoading, setIsProfileLoading] = useState(() => {
        try {
            const targetId = resolveTargetId();
            if (globalPreloadCache[targetId]?.artistData) return false;
            if (localStorage.getItem('demoArtistData_' + targetId)) return false;
            if (targetId === '@victor_ink' || targetId === 'victor_ink' || targetId === 'demo' || targetId === '@demo' || targetId === 'anonymous_demo') return false;
        } catch(e) {}
        return true;
    });`;

code = code.replace(target1, replacement1).replace(target2, replacement2);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
