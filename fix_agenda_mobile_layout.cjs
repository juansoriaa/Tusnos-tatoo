const fs = require('fs');
let content = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

// Ensure that mobile agenda is well-formed with the 3 on top of the icon 
// and the span doesn't look misaligned.
// Right now I have `<span className={\`absolute -top-2 -right-3...` which is good for the notification counter.

