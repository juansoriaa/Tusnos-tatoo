const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// Normalize newlines to \n to make regex matching predictable
file = file.replace(/\r\n/g, '\n');

// 1. Add hasUnsavedChangesRef
if (!file.includes('const hasUnsavedChangesRef = useRef(false);')) {
    file = file.replace(
        /const unsubRef = useRef<\(\(\) => void\) \| null>\(null\);/,
        "const unsubRef = useRef<(() => void) | null>(null);\n    const hasUnsavedChangesRef = useRef(false);"
    );
}

// 2. Fix the onSnapshot race condition
file = file.replace(
    /unsubRef\.current = onSnapshot\(doc\(db, 'users', demoUserId\), \(docSnap\) => \{\n\s*if \(docSnap\.exists\(\)\) \{\n\s*const dbData = docSnap\.data\(\);\n\s*localStorage\.setItem\('demoArtistData_' \+ demoUserId, JSON\.stringify\(dbData\)\);\n\s*applyData\(dbData\);\n\s*\}\n\s*\}\);/,
    `unsubRef.current = onSnapshot(doc(db, 'users', demoUserId), (docSnap) => {
                            if (docSnap.exists()) {
                                const dbData = docSnap.data();
                                localStorage.setItem('demoArtistData_' + demoUserId, JSON.stringify(dbData));
                                if (!hasUnsavedChangesRef.current) {
                                    applyData(dbData);
                                }
                            }
                        });`
);

// 3. Fix syncFromStorage race condition
file = file.replace(
    /const syncFromStorage = \(\) => \{\n\s*const uid = localStorage\.getItem\('demoUserId'\);/,
    `const syncFromStorage = () => {
            if (hasUnsavedChangesRef.current) return;
            const uid = localStorage.getItem('demoUserId');`
);

// 4. Update the hasUnsavedChanges logic completely
file = file.replace(
    /let hasUnsavedChanges = false;\n\s*if \(initialDataStr !== ''\) \{\n\s*try \{\n\s*const initialData = JSON\.parse\(initialDataStr\);\n\s*for \(const key in currentData\) \{\n\s*if \(JSON\.stringify\(currentData\[key\]\) !== JSON\.stringify\(initialData\[key\]\)\) \{\n\s*hasUnsavedChanges = true;\n\s*break;\n\s*\}\n\s*\}\n\s*\} catch\(e\) \{\}\n\s*\}/s,
    `let hasUnsavedChanges = false;
    if (initialDataStr !== '') {
        try {
            const initial = JSON.parse(initialDataStr);
            if (name !== initial.name) hasUnsavedChanges = true;
            if (bio !== initial.bio) hasUnsavedChanges = true;
            if (specialty1 !== initial.specialty1) hasUnsavedChanges = true;
            if (specialty2 !== initial.specialty2) hasUnsavedChanges = true;
            if (specialty3 !== initial.specialty3) hasUnsavedChanges = true;
            if (isAvailable !== initial.isAvailable) hasUnsavedChanges = true;
            if (whatsapp !== initial.whatsapp) hasUnsavedChanges = true;
            if (loginEmail !== initial.loginEmail) hasUnsavedChanges = true;
            if (customPassword !== initial.customPassword) hasUnsavedChanges = true;
            if (instagram !== initial.instagram) hasUnsavedChanges = true;
            if (facebook !== initial.facebook) hasUnsavedChanges = true;
            if (tiktok !== initial.tiktok) hasUnsavedChanges = true;
            if (avatarUrl !== initial.avatarUrl) hasUnsavedChanges = true;
            if (bannerUrl !== initial.bannerUrl) hasUnsavedChanges = true;
            if (hasPhysicalStudio !== initial.hasPhysicalStudio) hasUnsavedChanges = true;
            if (studioName !== initial.studioName) hasUnsavedChanges = true;
            if (studioDescription !== initial.studioDescription) hasUnsavedChanges = true;
            if (studioAddress !== initial.studioAddress) hasUnsavedChanges = true;
            if (studioHours !== initial.studioHours) hasUnsavedChanges = true;
            if (mapLink !== initial.mapLink) hasUnsavedChanges = true;
            if (JSON.stringify(faqs) !== JSON.stringify(initial.faqs)) hasUnsavedChanges = true;
        } catch(e) {
            console.error(e);
        }
    }
    
    useEffect(() => {
        hasUnsavedChangesRef.current = hasUnsavedChanges;
    }, [hasUnsavedChanges]);`
);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);
console.log('Fix applied!');
