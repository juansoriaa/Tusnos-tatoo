const fs = require('fs');

let content = fs.readFileSync('firestore.rules', 'utf-8');

const oldRules = `    match /config/{configId} {
      allow read, write: if true;
    }`;
const newRules = `    match /config/{configId} {
      allow read, write: if true;
    }
    
    match /appointments/{appointmentId} {
      allow read, write: if true;
    }
    
    match /waitlist/{waitlistId} {
      allow read, write: if true;
    }`;

content = content.replace(oldRules, newRules);
fs.writeFileSync('firestore.rules', content);
