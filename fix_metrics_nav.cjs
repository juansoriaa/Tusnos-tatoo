const fs = require('fs');

// Update App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('DemoMetrics')) {
    app = app.replace("import DemoWaitlist from './components/DemoWaitlist';", "import DemoWaitlist from './components/DemoWaitlist';\nimport DemoMetrics from './components/DemoMetrics';");
    app = app.replace('<Route path="/demo/waitlist" element={<DemoWaitlist />} />', '<Route path="/demo/waitlist" element={<DemoWaitlist />} />\n        <Route path="/demo/metrics" element={<DemoMetrics />} />');
    fs.writeFileSync('src/App.tsx', app);
}

// Update DemoDashboard.tsx nav links
let dashboard = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');
const dashboardOldNav = `<a className="flex flex-col items-center text-on-surface p-2 hover:text-primary transition-all active:scale-95" href="#" onClick={(e) => e.preventDefault()}>
                    <span className="material-symbols-outlined mb-1">analytics</span>
                    <span className="font-label-sm text-[10px]">Metrics</span>
                </a>`;
const dashboardNewNav = `<a className="flex flex-col items-center text-on-surface p-2 hover:text-primary transition-all active:scale-95" href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/metrics'); }}>
                    <span className="material-symbols-outlined mb-1">analytics</span>
                    <span className="font-label-sm text-[10px]">Metrics</span>
                </a>`;
dashboard = dashboard.replace(dashboardOldNav, dashboardNewNav);
fs.writeFileSync('src/components/DemoDashboard.tsx', dashboard);

// Update DemoPortfolio.tsx nav links
let portfolio = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');
const portfolioOldNav = `<a className="flex flex-col items-center text-on-surface-variant p-2 active:scale-95 transition-transform" href="#" onClick={(e) => e.preventDefault()}><span className="material-symbols-outlined mb-1">analytics</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Metrics</span></a>`;
const portfolioNewNav = `<a className="flex flex-col items-center text-on-surface-variant p-2 active:scale-95 transition-transform" href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/metrics'); }}><span className="material-symbols-outlined mb-1">analytics</span>
            <span className="font-label-sm text-[10px] text-on-surface-variant">Metrics</span></a>`;
portfolio = portfolio.replace(portfolioOldNav, portfolioNewNav);
fs.writeFileSync('src/components/DemoPortfolio.tsx', portfolio);

// Update DemoWaitlist.tsx nav links
let waitlist = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');
const waitlistOldNav = `<a className="flex flex-col items-center text-on-surface-variant p-2 active:scale-95 transition-all" href="#" onClick={(e) => e.preventDefault()}>
                    <span className="material-symbols-outlined mb-1">analytics</span>
                    <span className="font-label-sm text-label-sm">Metrics</span>
                </a>`;
const waitlistNewNav = `<a className="flex flex-col items-center text-on-surface-variant p-2 active:scale-95 transition-all" href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/metrics'); }}>
                    <span className="material-symbols-outlined mb-1">analytics</span>
                    <span className="font-label-sm text-label-sm">Metrics</span>
                </a>`;
waitlist = waitlist.replace(waitlistOldNav, waitlistNewNav);
fs.writeFileSync('src/components/DemoWaitlist.tsx', waitlist);
