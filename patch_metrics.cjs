const fs = require('fs');

let content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf-8');

const oldChartLogic = `    const chartData = useMemo(() => {
        let data = [];
        let actualTotal = metrics[chartMetric] || 0;
        
        // For 'day', we generate 8 points. 
        // For 'week', 7 points.
        // For 'month', 10 points.
        
        if (actualTotal === 0) {
            if (chartPeriod === 'day') {
                for (let i = 8; i <= 22; i+=2) data.push({ name: \`\${i}:00\`, value: 0 });
            } else if (chartPeriod === 'week') {
                const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                for (let i = 0; i < 7; i++) data.push({ name: days[i], value: 0 });
            } else if (chartPeriod === 'month') {
                for (let i = 1; i <= 30; i+=3) data.push({ name: \`\${i}\`, value: 0 });
            }
            return data;
        }

        // If we have data, we divide it across the period somewhat realistically
        // We simulate a realistic distribution where the sum approximates actualTotal (or scales with it)
        const base = actualTotal;
        
        if (chartPeriod === 'day') {
            for (let i = 8; i <= 22; i+=2) {
                let multiplier = 0.02;
                if (i >= 12 && i <= 14) multiplier = 0.1;
                if (i >= 18 && i <= 20) multiplier = 0.15;
                const value = Math.floor(base * (multiplier + (Math.random() * 0.05)));
                data.push({ name: \`\${i}:00\`, value });
            }
        } else if (chartPeriod === 'week') {
            const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            for (let i = 0; i < 7; i++) {
                let multiplier = 0.1;
                if (i >= 4) multiplier = 0.18;
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
    }, [chartMetric, chartPeriod, metrics]);`;

const newChartLogic = `    const chartData = useMemo(() => {
        let data = [];
        let actualTotal = metrics[chartMetric] || 0;
        
        let labels = [];
        if (chartPeriod === 'day') {
            for (let i = 8; i <= 22; i+=2) labels.push(\`\${i}:00\`);
        } else if (chartPeriod === 'week') {
            labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        } else if (chartPeriod === 'month') {
            for (let i = 1; i <= 30; i+=3) labels.push(\`\${i}\`);
        }
        
        let buckets = new Array(labels.length).fill(0);
        
        if (actualTotal > 0) {
            // Distribute exact total randomly among buckets to ensure sum matches exactly
            for (let i = 0; i < actualTotal; i++) {
                // Bias slightly towards more recent/end of period
                let r = Math.random();
                let bucketIndex = Math.floor(Math.pow(r, 0.8) * labels.length);
                if (bucketIndex >= labels.length) bucketIndex = labels.length - 1;
                buckets[bucketIndex]++;
            }
        }
        
        for (let i = 0; i < labels.length; i++) {
            data.push({ name: labels[i], value: buckets[i] });
        }
        
        return data;
    }, [chartMetric, chartPeriod, metrics]);`;

content = content.replace(oldChartLogic, newChartLogic);
fs.writeFileSync('src/components/DemoMetrics.tsx', content);
