import fs from 'fs';
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

const target1 = `    return (
        <div className="bg-deep-black text-silver-text font-body-md h-[100dvh] overflow-hidden flex text-[#e5e2e1] bg-[#050505]">`;
const rep1 = `    return (
        <div className={\`bg-deep-black text-silver-text font-body-md h-[100dvh] overflow-hidden flex text-[#e5e2e1] bg-[#050505] \${theme === 'pink_neon' ? 'theme-pink-neon' : ''}\`}>`;

code = code.replace(target1, rep1);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
