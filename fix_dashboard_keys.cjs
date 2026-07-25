const fs = require('fs');

let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

content = content.replace(/'demoArtistData'/g, "'demoArtistData_demo'");

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
