const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

code = code.replace(
    /\{isDemoAccount \? '24\.5%' : '0%'\}/,
    `{metrics.views > 0 ? ((metrics.whatsappClicks + metrics.agendaClicks) / metrics.views * 100).toFixed(1) + '%' : '0%'}`
);

code = code.replace(
    /\{isDemoAccount \? calcIncrease\(24\.5, currentPeriod, 'conversion'\) : '0\.0%'\}/,
    `{metrics.views > 0 ? calcIncrease(((metrics.whatsappClicks + metrics.agendaClicks) / metrics.views * 100), currentPeriod, 'conversion') : '0.0%'}`
);

fs.writeFileSync('src/components/DemoMetrics.tsx', code);
