const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace('<Route path="/demo/dashboard" element={<DemoDashboard />} />', '<Route path="/demo/dashboard" element={<DemoDashboard />} />\n          <Route path="/:id/dashboard" element={<DemoDashboard />} />');
appCode = appCode.replace('<Route path="/demo/portfolio" element={<DemoPortfolio />} />', '<Route path="/demo/portfolio" element={<DemoPortfolio />} />\n          <Route path="/:id/portfolio" element={<DemoPortfolio />} />');
appCode = appCode.replace('<Route path="/demo/waitlist" element={<DemoWaitlist />} />', '<Route path="/demo/waitlist" element={<DemoWaitlist />} />\n          <Route path="/:id/waitlist" element={<DemoWaitlist />} />');
appCode = appCode.replace('<Route path="/demo/metrics" element={<DemoMetrics />} />', '<Route path="/demo/metrics" element={<DemoMetrics />} />\n          <Route path="/:id/metrics" element={<DemoMetrics />} />');

fs.writeFileSync('src/App.tsx', appCode);
