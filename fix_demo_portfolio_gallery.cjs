const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// 1. Remove photo.size block in gallery
const sizeBlock = `                    {photo.size && (
                        <div className="absolute top-2 right-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-deep-black/80 backdrop-blur-sm rounded px-1.5 py-0.5 font-label-sm text-on-surface-variant border border-border-muted text-[10px]" style={{backgroundColor: 'rgba(5,5,5,0.8)', borderColor: '#353434'}}>{photo.size}</span>
                        </div>
                    )}`;
content = content.replace(sizeBlock, '');

// 2. Change brush icon style
const oldBrush = `                    <button 
                        onClick={(e) => { e.stopPropagation(); startEditing(photo); }}
                        className="absolute top-2 right-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-surface-elevation/80 backdrop-blur-sm border border-border-muted rounded-full p-1.5 hover:border-emerald-accent hover:text-emerald-accent text-silver-text z-10" 
                        style={{backgroundColor: 'rgba(20,19,19,0.8)', borderColor: '#353434', color: '#e5e2e1'}}
                        title="Editar foto"
                    >
                        <span className="material-symbols-outlined text-[16px]">brush</span>
                    </button>`;
const newBrush = `                    <button 
                        onClick={(e) => { e.stopPropagation(); startEditing(photo); }}
                        className="absolute top-1 right-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-surface-elevation/80 backdrop-blur-sm border border-border-muted rounded-full p-1 hover:border-emerald-accent hover:text-emerald-accent text-silver-text z-10" 
                        style={{backgroundColor: 'rgba(20,19,19,0.8)', borderColor: '#353434', color: '#e5e2e1'}}
                        title="Editar foto"
                    >
                        <span className="material-symbols-outlined text-[14px]">brush</span>
                    </button>`;
content = content.replace(oldBrush, newBrush);

// 3. Add id="subir-obra-section"
const oldSection = `<section className="bg-surface-elevation p-4 md:p-5 border border-border-muted rounded-lg w-full" style={{backgroundColor: '#141313', borderColor: '#353434'}}>`;
const newSection = `<section id="subir-obra-section" className="bg-surface-elevation p-4 md:p-5 border border-border-muted rounded-lg w-full" style={{backgroundColor: '#141313', borderColor: '#353434'}}>`;
content = content.replace(oldSection, newSection);

// 4. Update startEditing scrolling
const oldScroll = `window.scrollTo({ top: 0, behavior: 'smooth' });`;
const newScroll = `setTimeout(() => {
            document.getElementById('subir-obra-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);`;
content = content.replace(oldScroll, newScroll);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
