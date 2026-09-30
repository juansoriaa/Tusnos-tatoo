const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// 1. Add `const [hasNewUploads, setHasNewUploads] = useState(false);`
file = file.replace(
    /const \[isUploading, setIsUploading\] = useState\(false\);/g,
    `const [isUploading, setIsUploading] = useState(false);\n    const [hasNewUploads, setHasNewUploads] = useState(false);`
);

// 2. Set it to true when upload succeeds
file = file.replace(
    /setUrl\(imgbbRes\.url\);/g,
    `setUrl(imgbbRes.url);\n                setHasNewUploads(true);`
);

// 3. Set it to false when save all completes
file = file.replace(
    /setInitialDataStr\(JSON\.stringify\(currentData\)\);/g,
    `setInitialDataStr(JSON.stringify(currentData));\n        setHasNewUploads(false);`
);

// 4. Update the render condition
file = file.replace(
    /\{\(hasUnsavedChanges \|\| isUploading\) && \(/g,
    `{(hasUnsavedChanges || isUploading || hasNewUploads) && (`
);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);
console.log('Added hasNewUploads logic to DemoDashboard!');
