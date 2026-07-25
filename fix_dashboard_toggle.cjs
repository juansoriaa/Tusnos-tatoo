const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const oldToggle = `<input 
                                 className="toggle-checkbox absolute block w-8 h-8 rounded-none bg-surface border-2 border-outline-variant appearance-none cursor-pointer z-10"
                                 id="toggle"
                                 name="toggle"
                                 type="checkbox"
                                checked={!isAvailable}
                                onChange={(e) => setIsAvailable(!e.target.checked)}
                            />`;

const newToggle = `<input 
                                 className="toggle-checkbox peer absolute block w-8 h-8 rounded-none bg-surface border-2 border-outline-variant appearance-none cursor-pointer z-10 checked:translate-x-8 checked:border-emerald-accent transition-transform duration-300 ease-in-out"
                                 id="toggle"
                                 name="toggle"
                                 type="checkbox"
                                checked={!isAvailable}
                                onChange={(e) => {
                                    const newIsAvailable = !e.target.checked;
                                    setIsAvailable(newIsAvailable);
                                    window.dispatchEvent(new CustomEvent('agendaStatusChanged', { detail: newIsAvailable }));
                                }}
                                style={{borderColor: !isAvailable ? '#054d44' : ''}}
                            />`;

content = content.replace(oldToggle, newToggle);

const oldLabel = `<label className="toggle-label block overflow-hidden h-8 rounded-none bg-surface-variant cursor-pointer" htmlFor="toggle"></label>`;
const newLabel = `<label className="toggle-label block overflow-hidden h-8 rounded-none bg-surface-variant cursor-pointer peer-checked:bg-primary/20 transition-colors duration-300" htmlFor="toggle"></label>`;

content = content.replace(oldLabel, newLabel);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
