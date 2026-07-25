const fs = require('fs');
let content = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

const oldTag = `<span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded">
                                    Referencia subida
                                </span>`;
                                
const newTag = `<span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-outline-variant/50 rounded">
                                    Referencia subida
                                </span>`;

content = content.replace(oldTag, newTag);
fs.writeFileSync('src/components/DemoWaitlist.tsx', content);
