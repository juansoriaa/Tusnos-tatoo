const fs = require('fs');

let content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

content = content.replace(/const \\\[chartMetric, setChartMetric\\\] = useState\\\('views'\\\);/g, "const [chartMetric, setChartMetric] = useState('views');");

fs.writeFileSync('src/components/DemoMetrics.tsx', content);
