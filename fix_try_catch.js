import fs from 'fs';
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

code = code.replace(
  /                \}\)\);\n            \} catch \(e\) \{\}\n/g,
  "                }));\n            } catch (e) { console.error('Error in setInitialDataStr block', e); }\n"
);

fs.writeFileSync('src/components/DemoDashboard.tsx', code);
