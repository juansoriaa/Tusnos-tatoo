const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// Add a ref to track if the user has unsaved changes
if (!file.includes('const hasUnsavedChangesRef = useRef(false);')) {
    file = file.replace(
        /const unsubRef = useRef<\(\(\) => void\) \| null>\(null\);/,
        "const unsubRef = useRef<(() => void) | null>(null);\n    const hasUnsavedChangesRef = useRef(false);"
    );
}

// Update the ref whenever hasUnsavedChanges is evaluated
file = file.replace(
    /let hasUnsavedChanges = false;/g,
    "let hasUnsavedChanges = false;"
);

// We need to update hasUnsavedChangesRef right after hasUnsavedChanges is computed
file = file.replace(
    /if \(JSON\.stringify\(faqs\) !== JSON\.stringify\(initial\.faqs\)\) hasUnsavedChanges = true;\n\s+\} catch\(e\) \{\n\s+console\.error\("Error computing unsaved changes", e\);\n\s+\}\n\s+\}/,
    `if (JSON.stringify(faqs) !== JSON.stringify(initial.faqs)) hasUnsavedChanges = true;
        } catch(e) {
            console.error("Error computing unsaved changes", e);
        }
    }
    
    // Update ref so async callbacks (like onSnapshot) know if they should overwrite user input
    useEffect(() => {
        hasUnsavedChangesRef.current = hasUnsavedChanges;
    }, [hasUnsavedChanges]);`
);

// Now protect the onSnapshot callback
file = file.replace(
    /unsubRef\.current = onSnapshot\(doc\(db, 'users', demoUserId\), \(docSnap\) => \{\n\s+if \(docSnap\.exists\(\)\) \{\n\s+const dbData = docSnap\.data\(\);\n\s+localStorage\.setItem\('demoArtistData_' \+ demoUserId, JSON\.stringify\(dbData\)\);\n\s+applyData\(dbData\);\n\s+\}\n\s+\}\);/,
    `unsubRef.current = onSnapshot(doc(db, 'users', demoUserId), (docSnap) => {
                            if (docSnap.exists()) {
                                const dbData = docSnap.data();
                                localStorage.setItem('demoArtistData_' + demoUserId, JSON.stringify(dbData));
                                // NEVER overwrite if the user is currently typing/has unsaved changes
                                if (!hasUnsavedChangesRef.current) {
                                    applyData(dbData);
                                }
                            }
                        });`
);

// Also protect syncFromStorage
file = file.replace(
    /const syncFromStorage = \(\) => \{\n\s+const uid = localStorage\.getItem\('demoUserId'\);/,
    `const syncFromStorage = () => {
            if (hasUnsavedChangesRef.current) return;
            const uid = localStorage.getItem('demoUserId');`
);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);
console.log('Fixed snapshot overwrite race condition');
