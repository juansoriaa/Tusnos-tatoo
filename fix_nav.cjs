const fs = require('fs');

// Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('DemoWaitlist')) {
    app = app.replace("import DemoPortfolio from './components/DemoPortfolio';", "import DemoPortfolio from './components/DemoPortfolio';\nimport DemoWaitlist from './components/DemoWaitlist';");
    app = app.replace('<Route path="/demo/portfolio" element={<DemoPortfolio />} />', '<Route path="/demo/portfolio" element={<DemoPortfolio />} />\n        <Route path="/demo/waitlist" element={<DemoWaitlist />} />');
    fs.writeFileSync('src/App.tsx', app);
}

// Update DemoDashboard.tsx nav links
let dashboard = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');
const dashboardOldNav = `<a className="flex flex-col items-center text-on-surface p-2 hover:text-primary transition-all active:scale-95" href="#" onClick={(e) => e.preventDefault()}>
                    <span className="material-symbols-outlined mb-1">calendar_today</span>
                    <span className="font-label-sm text-[10px]">Schedule</span>
                </a>`;
const dashboardNewNav = `<a className="flex flex-col items-center text-on-surface p-2 hover:text-primary transition-all active:scale-95" href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }}>
                    <span className="material-symbols-outlined mb-1">calendar_today</span>
                    <span className="font-label-sm text-[10px]">Schedule</span>
                </a>`;
dashboard = dashboard.replace(dashboardOldNav, dashboardNewNav);
fs.writeFileSync('src/components/DemoDashboard.tsx', dashboard);

// Update DemoPortfolio.tsx nav links
let portfolio = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');
const portfolioOldNav = `<a className="flex flex-col items-center text-on-surface-variant p-2 active:scale-95 transition-transform" href="#" onClick={(e) => e.preventDefault()}><span className="material-symbols-outlined mb-1">calendar_today</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Schedule</span></a>`;
const portfolioNewNav = `<a className="flex flex-col items-center text-on-surface-variant p-2 active:scale-95 transition-transform" href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }}><span className="material-symbols-outlined mb-1">calendar_today</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Schedule</span></a>`;
portfolio = portfolio.replace(portfolioOldNav, portfolioNewNav);
fs.writeFileSync('src/components/DemoPortfolio.tsx', portfolio);

