const fs = require('fs');
let code = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const mockStart = code.indexOf('<div className="w-full max-w-[280px] bg-black rounded-[2rem]');
if (mockStart !== -1) {
    const nextSection = code.indexOf('          <section className="px-gutter max-w-container-max mx-auto relative z-10 my-24 md:my-32">', mockStart);
    if (nextSection !== -1) {
        // Let's go back slightly to the end of the previous section
        const sectionEnd = code.lastIndexOf('        </section>', nextSection);
        if (sectionEnd !== -1) {
            // we have to be careful not to delete too much
            // The waitlist mock starts inside the grid
            const gridStart = code.indexOf('<div className="grid grid-cols-1 md:grid-cols-12 gap-6">', mockStart - 2000);
        }
    }
}
