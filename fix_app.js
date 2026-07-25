const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes('DemoDashboard')) {
    app = app.replace('import SuperAdmin from \'./components/SuperAdmin\';', 'import SuperAdmin from \'./components/SuperAdmin\';\nimport DemoDashboard from \'./components/DemoDashboard\';');
    app = app.replace('<Route path="/superadmin" element={<SuperAdmin />} />', '<Route path="/superadmin" element={<SuperAdmin />} />\n        <Route path="/demo/dashboard" element={<DemoDashboard />} />');
    fs.writeFileSync('src/App.tsx', app);
}
