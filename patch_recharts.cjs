const fs = require('fs');

let content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

// Add Recharts imports
const imports = `import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoLayout from './DemoLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';`;

content = content.replace(/import React, \{ useState, useEffect \} from 'react';\nimport \{ useNavigate \} from 'react-router-dom';\nimport DemoLayout from '\.\/DemoLayout';/, imports);


const stateAdditions = `
    const [chartMetric, setChartMetric] = useState('views');
    const [chartPeriod, setChartPeriod] = useState('week');

    const chartData = useMemo(() => {
        const baseValues = {
            views: { day: 1500, week: 11025, month: 45000 },
            photoClicks: { day: 150, week: 1140, month: 4800 },
            whatsappClicks: { day: 90, week: 790, month: 3200 }
        };
        const base = baseValues[chartMetric][chartPeriod];
        let data = [];
        if (chartPeriod === 'day') {
            for (let i = 8; i <= 22; i+=2) {
                // Generate a believable curve
                let multiplier = 0.02;
                if (i >= 12 && i <= 14) multiplier = 0.1; // lunch peak
                if (i >= 18 && i <= 20) multiplier = 0.15; // evening peak
                const value = Math.floor(base * (multiplier + (Math.random() * 0.05)));
                data.push({ name: \`\${i}:00\`, value });
            }
        } else if (chartPeriod === 'week') {
            const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            for (let i = 0; i < 7; i++) {
                let multiplier = 0.1;
                if (i >= 4) multiplier = 0.18; // weekend peak
                const value = Math.floor(base * (multiplier + (Math.random() * 0.05)));
                data.push({ name: days[i], value });
            }
        } else if (chartPeriod === 'month') {
            for (let i = 1; i <= 30; i+=3) {
                const value = Math.floor((base/10) * (0.8 + (Math.random() * 0.4)));
                data.push({ name: \`\${i}\`, value });
            }
        }
        return data;
    }, [chartMetric, chartPeriod]);

    const chartTitles = {
        views: 'Visitas Totales',
        photoClicks: 'Clicks en Fotos',
        whatsappClicks: 'Clicks en WhatsApp'
    };

`;

const searchRegexForState = /    const currentPeriod = periods\[periodIndex\];/;
content = content.replace(searchRegexForState, "    const currentPeriod = periods[periodIndex];\n" + stateAdditions);

fs.writeFileSync('src/components/DemoMetrics.tsx', content);
