const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

content = content.replace(
    /setSpecialty1\(data\.specialtyTags \? \(data\.specialtyTags\[0\] \|\| ''\) : 'Realismo'\);/g,
    "setSpecialty1((data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[0] || '') : 'Realismo');"
);
content = content.replace(
    /setSpecialty2\(data\.specialtyTags \? \(data\.specialtyTags\[1\] \|\| ''\) : 'Black & Grey'\);/g,
    "setSpecialty2((data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[1] || '') : 'Black & Grey');"
);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
