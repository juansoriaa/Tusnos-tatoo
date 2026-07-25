const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const oldButtonStr = `<button className="w-full border border-border-muted rounded bg-surface-elevation/80 backdrop-blur-sm text-silver-text py-1.5 font-label-md text-xs hover:border-emerald-accent transition-colors flex justify-center items-center" style={{borderColor: '#353434', backgroundColor: 'rgba(20,19,19,0.8)', color: '#e5e2e1'}}>
                    <span className="material-symbols-outlined text-[14px] mr-1">edit</span> Editar
                                                        </button>`;

const newButtonStr = `<button onClick={(e) => { e.stopPropagation(); startEditing(photo); }} className="w-full border border-border-muted rounded bg-surface-elevation/80 backdrop-blur-sm text-silver-text py-1.5 font-label-md text-xs hover:border-emerald-accent transition-colors flex justify-center items-center" style={{borderColor: '#353434', backgroundColor: 'rgba(20,19,19,0.8)', color: '#e5e2e1'}}>
                    <span className="material-symbols-outlined text-[14px] mr-1">edit</span> Editar
                                                        </button>`;

content = content.replace(oldButtonStr, newButtonStr);

const overlayGradient = '<div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>';

const brushButtonStr = `
                    <button 
                        onClick={(e) => { e.stopPropagation(); startEditing(photo); }}
                        className="absolute top-2 right-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-surface-elevation/80 backdrop-blur-sm border border-border-muted rounded-full p-1.5 hover:border-emerald-accent hover:text-emerald-accent text-silver-text z-10" 
                        style={{backgroundColor: 'rgba(20,19,19,0.8)', borderColor: '#353434', color: '#e5e2e1'}}
                        title="Editar foto"
                    >
                        <span className="material-symbols-outlined text-[16px]">brush</span>
                    </button>
`;

content = content.replace(overlayGradient, overlayGradient + brushButtonStr);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
