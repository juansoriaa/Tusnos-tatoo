const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const targetHeader = `<div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface text-2xl">Bienvenido, {name}</h2>
                        <p className="text-on-surface-variant mt-2 text-sm">Gestiona tu estudio y agenda desde aquí.</p>
                    </div>`;

const newHeader = `<div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface text-2xl mb-3">Bienvenido, {name}</h2>
                        {(() => {
                            const tags = [specialty1, specialty2, specialty3].filter(Boolean);
                            if (tags.length === 0) return null;
                            const count = tags.length;
                            let containerClass = "flex mb-4 w-full ";
                            if (count === 1) containerClass += "gap-2";
                            else if (count === 2) containerClass += "gap-6 md:gap-8";
                            else containerClass += "gap-2 justify-between md:justify-start md:gap-4";
                            
                            return (
                                <div className={containerClass}>
                                    {tags.map((tag, index) => (
                                        <span key={index} className="px-2 py-1 md:px-3 md:py-1 bg-surface-container border border-outline-variant font-caption text-[9px] md:text-xs text-on-surface-variant uppercase tracking-widest whitespace-nowrap truncate max-w-[32%] md:max-w-none text-center flex-1 md:flex-none">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            );
                        })()}
                        <p className="text-on-surface-variant mt-2 text-sm">Gestiona tu estudio y agenda desde aquí.</p>
                    </div>`;

content = content.replace(targetHeader, newHeader);
fs.writeFileSync('src/components/DemoDashboard.tsx', content);

