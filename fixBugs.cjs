const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// 1. Update initData to match _defaultTagsState
file = file.replace(
    /specialtyTags: \['', ''\],/,
    "specialtyTags: ['Realismo', 'Black & Grey'],"
);

// 2. Remove the useEffect that updates hasUnsavedChangesRef
file = file.replace(
    /useEffect\(\(\) => \{\n\s*hasUnsavedChangesRef\.current = hasUnsavedChanges;\n\s*\}, \[hasUnsavedChanges\]\);/,
    ""
);

// 3. Update hasUnsavedChangesRef synchronously during render
file = file.replace(
    /if \(JSON\.stringify\(faqs\) !== JSON\.stringify\(initial\.faqs\)\) hasUnsavedChanges = true;\n\s*\} catch\(e\) \{\n\s*console\.error\(e\);\n\s*\}\n\s*\}/,
    `if (JSON.stringify(faqs) !== JSON.stringify(initial.faqs)) hasUnsavedChanges = true;
        } catch(e) {
            console.error(e);
        }
    }
    hasUnsavedChangesRef.current = hasUnsavedChanges;`
);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);
console.log('Fixed both bugs!');
