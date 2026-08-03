const fs = require('fs');
const content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf-8');

const m1 = content.match(/setInitialDataStr\(JSON\.stringify\(\{(.*?)\}\)\)/s);
if (m1) {
  const objStr = "{" + m1[1] + "}";
  console.log("Found initialData:");
  // just extract keys
  const keys = m1[1].split('\n').filter(l => l.includes(':')).map(l => l.trim().split(':')[0]);
  console.log(keys);
}

const m2 = content.match(/const currentData = \{(.*?)\};/s);
if (m2) {
  console.log("Found currentData:");
  const keys2 = m2[1].split(',').map(k => k.trim()).filter(k => k);
  console.log(keys2);
}
