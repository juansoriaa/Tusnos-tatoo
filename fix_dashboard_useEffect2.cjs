const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// We should only use the default if specialtyTags was completely absent from the object
// (meaning an older save or first time). If it's present, even if empty, use it.
content = content.replace(
    /setSpecialty1\(data\.specialtyTags\?\.\[0\] !== undefined \? data\.specialtyTags\[0\] : 'Realismo'\);/g,
    "setSpecialty1(data.specialtyTags ? (data.specialtyTags[0] || '') : 'Realismo');"
);
content = content.replace(
    /setSpecialty2\(data\.specialtyTags\?\.\[1\] !== undefined \? data\.specialtyTags\[1\] : 'Black & Grey'\);/g,
    "setSpecialty2(data.specialtyTags ? (data.specialtyTags[1] || '') : 'Black & Grey');"
);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
