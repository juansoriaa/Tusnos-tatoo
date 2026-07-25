const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

content = content.replace(
    /setSpecialty1\(data\.specialtyTags\?\.\[0\] \|\| ''\);/g,
    "setSpecialty1(data.specialtyTags?.[0] !== undefined ? data.specialtyTags[0] : 'Realismo');"
);
content = content.replace(
    /setSpecialty2\(data\.specialtyTags\?\.\[1\] \|\| ''\);/g,
    "setSpecialty2(data.specialtyTags?.[1] !== undefined ? data.specialtyTags[1] : 'Black & Grey');"
);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
