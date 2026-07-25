const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

content = content.replace(
    'onClick={() => window.open(`/artist/${detailsModalUser.uid}`, "_blank")}',
    'onClick={() => { setDetailsModalUser(null); navigate(`/artist/${detailsModalUser.uid}`); }}'
);

fs.writeFileSync('src/components/SuperAdmin.tsx', content);

