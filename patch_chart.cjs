const fs = require('fs');

let content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

const newChartSection = `                {/* Charts & Ranking Section */}
                <section className="flex flex-col gap-6 mb-8">
                    {/* Performance Chart */}
                    <div className="bg-surface-elevation border border-border-muted p-5" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        
                        {/* Header & Selectors */}
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6 border-b border-border-muted pb-4" style={{borderColor: '#353434'}}>
                            
                            {/* Metric Selector */}
                            <div className="flex items-center gap-2">
                                <div className="flex bg-surface-container-high rounded p-1 border border-border-muted" style={{backgroundColor: '#2a2a2a', borderColor: '#353434'}}>
                                    <button 
                                        onClick={() => setChartMetric('views')}
                                        className={\`px-3 py-1 font-label-sm text-[10px] uppercase transition-all rounded \${chartMetric === 'views' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:text-silver-text'}\`}
                                        style={chartMetric === 'views' ? {backgroundColor: '#054d44'} : {}}
                                    >
                                        Visitas
                                    </button>
                                    <button 
                                        onClick={() => setChartMetric('photoClicks')}
                                        className={\`px-3 py-1 font-label-sm text-[10px] uppercase transition-all rounded \${chartMetric === 'photoClicks' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:text-silver-text'}\`}
                                        style={chartMetric === 'photoClicks' ? {backgroundColor: '#054d44'} : {}}
                                    >
                                        Fotos
                                    </button>
                                    <button 
                                        onClick={() => setChartMetric('whatsappClicks')}
                                        className={\`px-3 py-1 font-label-sm text-[10px] uppercase transition-all rounded \${chartMetric === 'whatsappClicks' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:text-silver-text'}\`}
                                        style={chartMetric === 'whatsappClicks' ? {backgroundColor: '#054d44'} : {}}
                                    >
                                        WhatsApp
                                    </button>
                                </div>
                            </div>
                            
                            {/* Time Period Selector */}
                            <div className="flex border border-border-muted w-full md:w-auto min-w-[200px]" style={{borderColor: '#353434'}}>
                                <button 
                                    onClick={() => setChartPeriod('day')}
                                    className={\`flex-1 py-1.5 font-label-sm text-label-sm uppercase active:scale-95 transition-all border-r border-border-muted text-[10px] \${chartPeriod === 'day' ? 'bg-surface-container-high text-silver-text border-b-2 border-b-primary-container' : 'bg-transparent text-on-surface-variant hover:text-silver-text'}\`}
                                    style={chartPeriod === 'day' ? {backgroundColor: '#2a2a2a', borderColor: '#353434', borderBottomColor: '#054d44'} : {borderColor: '#353434'}}
                                >
                                    Día
                                </button>
                                <button 
                                    onClick={() => setChartPeriod('week')}
                                    className={\`flex-1 py-1.5 font-label-sm text-label-sm uppercase active:scale-95 transition-all border-r border-border-muted text-[10px] \${chartPeriod === 'week' ? 'bg-surface-container-high text-silver-text border-b-2 border-b-primary-container' : 'bg-transparent text-on-surface-variant hover:text-silver-text'}\`}
                                    style={chartPeriod === 'week' ? {backgroundColor: '#2a2a2a', borderColor: '#353434', borderBottomColor: '#054d44'} : {borderColor: '#353434'}}
                                >
                                    Sem
                                </button>
                                <button 
                                    onClick={() => setChartPeriod('month')}
                                    className={\`flex-1 py-1.5 font-label-sm text-label-sm uppercase active:scale-95 transition-all text-[10px] \${chartPeriod === 'month' ? 'bg-surface-container-high text-silver-text border-b-2 border-b-primary-container' : 'bg-transparent text-on-surface-variant hover:text-silver-text'}\`}
                                    style={chartPeriod === 'month' ? {backgroundColor: '#2a2a2a', borderBottomColor: '#054d44'} : {}}
                                >
                                    Mes
                                </button>
                            </div>
                        </div>

                        {/* Chart Title */}
                        <div className="mb-4">
                            <h3 className="font-headline-md text-headline-md text-silver-text text-xl font-bold">{chartTitles[chartMetric as keyof typeof chartTitles]}</h3>
                        </div>

                        {/* Recharts Area Chart */}
                        <div className="w-full h-64 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#054d44" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#054d44" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#353434" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#bfc9c5', fontSize: 10 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#bfc9c5', fontSize: 10 }}
                                        tickFormatter={(value) => value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#2a2a2a', borderColor: '#353434', color: '#e5e2e1', fontSize: '12px' }}
                                        itemStyle={{ color: '#95d2c6' }}
                                        formatter={(value) => [formatNumber(value), '']}
                                        labelStyle={{ color: '#bfc9c5', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#054d44" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>`;

const searchRegexForChart = /                \{\/\* Charts & Ranking Section \*\/\}[\s\S]*?(?=                <div className="grid md:grid-cols-2 gap-6">)/;

content = content.replace(searchRegexForChart, newChartSection + '\n\n');
fs.writeFileSync('src/components/DemoMetrics.tsx', content);
