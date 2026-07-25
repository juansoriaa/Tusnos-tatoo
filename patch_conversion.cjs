const fs = require('fs');

let content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

const baseMetricsReplacement = `    const baseMetrics = {
        views: { day: 12200, week: 11025, month: 9500 },
        photoClicks: { day: 1180, week: 1140, month: 850 },
        whatsappClicks: { day: 830, week: 790, month: 520 },
        agendaClicks: { day: 45, week: 40, month: 25 },
        conversion: { day: 24.1, week: 22.1, month: 18.5 }
    };`;

content = content.replace(/    const baseMetrics = \{[\s\S]*?agendaClicks: \{ day: 45, week: 40, month: 25 \}\n    \};/, baseMetricsReplacement);

const calcIncreaseReplacement = `    const calcIncrease = (current, periodKey, metricName) => {
        const base = baseMetrics[metricName][periodKey];
        if (current <= base) return '0.0%';
        if (metricName === 'conversion') {
            return '+' + (current - base).toFixed(1) + '%';
        }
        return '+' + (((current - base) / base) * 100).toFixed(1) + '%';
    };`;

content = content.replace(/    const calcIncrease = \([\s\S]*?return '\+' \+ \(\(\(\(current - base\) \/ base\) \* 100\)\.toFixed\(1\)\) \+ '%';\n    \};/, calcIncreaseReplacement);

const conversionCardReplacement = `                    {/* Conversion Rate */}
                    <div className="bg-surface-elevation border border-primary-container p-3 flex flex-col justify-between relative overflow-hidden col-span-2" style={{backgroundColor: '#141313', borderColor: '#054d44'}}>
                        <div className="absolute top-0 right-0 w-12 h-12 bg-primary-container/10 -mr-6 -mt-6 rotate-45 border-l border-b border-primary-container/30" style={{backgroundColor: 'rgba(5, 77, 68, 0.1)', borderColor: 'rgba(5, 77, 68, 0.3)'}}></div>
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Tasa Conversión</h3>
                            <span className="material-symbols-outlined text-primary-container text-[18px]" style={{color: '#054d44'}}>analytics</span>
                        </div>
                        <div className="relative z-10">
                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">24.5%</p>
                            <p className={\`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-all duration-500 \${animating ? 'scale-110 text-emerald-accent' : ''}\`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                                <span className="transition-all duration-500 animate-fade-in" key={currentPeriod}>{calcIncrease(24.5, currentPeriod, 'conversion')}</span>
                                <span className="text-[9px] text-on-surface-variant ml-1 transition-all duration-500 animate-fade-in" key={\`label-\${currentPeriod}\`}>{periodLabels[currentPeriod]}</span>
                            </p>
                        </div>
                    </div>`;

const searchConversionRegex = /                    \{\/\* Conversion Rate \*\/\}[\s\S]*?<\/div>\n                    <\/div>/;

content = content.replace(searchConversionRegex, conversionCardReplacement);

fs.writeFileSync('src/components/DemoMetrics.tsx', content);
