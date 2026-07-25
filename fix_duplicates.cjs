const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

const targetStr = `                   if (renewalSearchTerm) {
                       const term = renewalSearchTerm.toLowerCase();
                       if (!u.displayName?.toLowerCase().includes(term) && !u.email?.toLowerCase().includes(term)) return false;
                   }
                   if (renewalSearchTerm) {
                       const term = renewalSearchTerm.toLowerCase();
                       if (!u.displayName?.toLowerCase().includes(term) && !u.email?.toLowerCase().includes(term)) return false;
                   }`;

const replaceStr = `                   if (renewalSearchTerm) {
                       const term = renewalSearchTerm.toLowerCase();
                       if (!u.displayName?.toLowerCase().includes(term) && !u.email?.toLowerCase().includes(term) && !u.userTag?.toLowerCase().includes(term)) return false;
                   }`;

content = content.replace(targetStr, replaceStr);

// Let's also fix the duplicate in the second grid filter length if present:
const targetStr2 = `                   if (renewalSearchTerm) {
                       const term = renewalSearchTerm.toLowerCase();
                       if (!u.displayName?.toLowerCase().includes(term) && !u.email?.toLowerCase().includes(term)) return false;
                   }`;
                   
content = content.replace(targetStr2, replaceStr); // Replace the next occurrence as well with userTag inclusion

fs.writeFileSync('src/components/SuperAdmin.tsx', content);
