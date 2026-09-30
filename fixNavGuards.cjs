const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// Update handleNavigate
file = file.replace(
    /if \(hasUnsavedChanges\) \{\n            setPendingNav\(path\);/g,
    `if (hasUnsavedChanges || hasNewUploads) {\n            setPendingNav(path);`
);

// Update BeforeUnloadEvent
file = file.replace(
    /if \(hasUnsavedChanges\) \{\n                e\.preventDefault\(\);/g,
    `if (hasUnsavedChanges || hasNewUploads) {\n                e.preventDefault();`
);

// Update BeforeUnloadEvent dependencies
file = file.replace(
    /\}, \[hasUnsavedChanges\]\);/g,
    `}, [hasUnsavedChanges, hasNewUploads]);`
);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);
console.log('Fixed pending navigation logic!');
