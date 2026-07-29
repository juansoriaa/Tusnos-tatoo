const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

code = code.replace(
    /<div className="absolute top-0 right-0 w-12 h-12 bg-primary-container\/10 -mr-6 -mt-6 rotate-45 border-l border-b border-primary-container\/30" style=\{\{backgroundColor: 'rgba\\(5, 77, 68, 0\.1\\)', borderColor: 'rgba\\(5, 77, 68, 0\.3\\)'\}\}><\/div>/,
    `<div className="absolute inset-0 overflow-hidden pointer-events-none rounded"><div className="absolute top-0 right-0 w-12 h-12 bg-primary-container/10 -mr-6 -mt-6 rotate-45 border-l border-b border-primary-container/30" style={{backgroundColor: 'rgba(5, 77, 68, 0.1)', borderColor: 'rgba(5, 77, 68, 0.3)'}}></div></div>`
);

fs.writeFileSync('src/components/DemoMetrics.tsx', code);
