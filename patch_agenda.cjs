const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// 1. Remove trackMetric('agendaClicks') when opening modal
code = code.replace(/trackMetric\('agendaClicks'\);\n\s*setWaitlistModalOpen\(true\);/g, 'setWaitlistModalOpen(true);');

// 2. Add trackMetric('agendaClicks') on submission
code = code.replace(
    /setWaitlistSuccess\(true\);\n\s*setTimeout\(\(\) => \{/g,
    `trackMetric('agendaClicks');\n                setWaitlistSuccess(true);\n                setTimeout(() => {`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
