const fs = require('fs');

let content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf-8');

const oldBtns = `                                    <button 
                                        onClick={() => setChartMetric('whatsappClicks')}
                                        className={\`px-3 py-1 font-label-sm text-[10px] uppercase transition-all rounded \${chartMetric === 'whatsappClicks' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:text-silver-text'}\`}
                                        style={chartMetric === 'whatsappClicks' ? {backgroundColor: '#054d44'} : {}}
                                    >
                                        WhatsApp
                                    </button>
                                </div>
                            </div>`;

const newBtns = `                                    <button 
                                        onClick={() => setChartMetric('whatsappClicks')}
                                        className={\`px-3 py-1 font-label-sm text-[10px] uppercase transition-all rounded \${chartMetric === 'whatsappClicks' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:text-silver-text'}\`}
                                        style={chartMetric === 'whatsappClicks' ? {backgroundColor: '#054d44'} : {}}
                                    >
                                        WhatsApp
                                    </button>
                                    <button 
                                        onClick={() => setChartMetric('agendaClicks')}
                                        className={\`px-3 py-1 font-label-sm text-[10px] uppercase transition-all rounded \${chartMetric === 'agendaClicks' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:text-silver-text'}\`}
                                        style={chartMetric === 'agendaClicks' ? {backgroundColor: '#054d44'} : {}}
                                    >
                                        Agenda
                                    </button>
                                </div>
                            </div>`;

content = content.replace(oldBtns, newBtns);
fs.writeFileSync('src/components/DemoMetrics.tsx', content);
