const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// 1. Remove it from the current location
file = file.replace(
    /const \[isUploading, setIsUploading\] = useState\(false\);\n    const \[hasNewUploads, setHasNewUploads\] = useState\(false\);/g,
    ''
);

// 2. Add it up top near initialDataStr
file = file.replace(
    /const \[initialDataStr, setInitialDataStr\] = useState\(''\);/g,
    `const [initialDataStr, setInitialDataStr] = useState('');\n    const [isUploading, setIsUploading] = useState(false);\n    const [hasNewUploads, setHasNewUploads] = useState(false);`
);

// Also need to fix the typo in handleBeforeUnload that I missed:
file = file.replace(
    /if \(hasUnsavedChanges\) \{\n                  e\.preventDefault\(\);/g,
    `if (hasUnsavedChanges || hasNewUploads) {\n                  e.preventDefault();`
);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);
console.log('Fixed ReferenceError in DemoDashboard!');
