const fs = require('fs');
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const oldNav = `<a className="flex flex-col items-center text-on-surface p-2 hover:text-primary transition-all active:scale-95" href="#" onClick={(e) => e.preventDefault()}>
                    <span className="material-symbols-outlined mb-1">photo_library</span>
                    <span className="font-label-sm text-[10px]">Portfolio</span>
                </a>`;

const newNav = `<a className="flex flex-col items-center text-on-surface p-2 hover:text-primary transition-all active:scale-95" href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/portfolio'); }}>
                    <span className="material-symbols-outlined mb-1">photo_library</span>
                    <span className="font-label-sm text-[10px]">Portfolio</span>
                </a>`;

if (code.includes('DemoDashboard() {')) {
    code = code.replace('export default function DemoDashboard() {', `import { useNavigate } from 'react-router-dom';\n\nexport default function DemoDashboard() {\n    const navigate = useNavigate();`);
}
code = code.replace(oldNav, newNav);

fs.writeFileSync('src/components/DemoDashboard.tsx', code);

let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('DemoPortfolio')) {
    app = app.replace("import DemoDashboard from './components/DemoDashboard';", "import DemoDashboard from './components/DemoDashboard';\nimport DemoPortfolio from './components/DemoPortfolio';");
    app = app.replace('<Route path="/demo/dashboard" element={<DemoDashboard />} />', '<Route path="/demo/dashboard" element={<DemoDashboard />} />\n        <Route path="/demo/portfolio" element={<DemoPortfolio />} />');
    fs.writeFileSync('src/App.tsx', app);
}
