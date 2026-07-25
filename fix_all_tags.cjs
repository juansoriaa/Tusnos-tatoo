const fs = require('fs');

// 1. Fix Preload.tsx
let preload = fs.readFileSync('src/components/Preload.tsx', 'utf8');
preload = preload.replace(
    /const \[specialties, setSpecialties\] = useState<string\[\]>\(\['Realismo', 'Black & Grey', 'Minimalista'\]\);/g,
    "const [specialties, setSpecialties] = useState<string[]>(['Realismo', 'Black & Grey']);"
);
preload = preload.replace(
    /const \[specialties, setSpecialties\] = useState<string\[\]>\(\['Realismo', 'Black & Grey'\]\);/g,
    "const [specialties, setSpecialties] = useState<string[]>(['Realismo', 'Black & Grey']);"
);
fs.writeFileSync('src/components/Preload.tsx', preload);

// 2. Fix ArtistProfile.tsx
let profile = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');
profile = profile.replace(
    /const tags = artistData\?\.specialtyTags \|\| \['BLACKWORK', 'DARK REALISM'\];/g,
    "const tags = (artistData?.specialtyTags && artistData.specialtyTags.length > 0) ? artistData.specialtyTags : ['Realismo', 'Black & Grey'];"
);
fs.writeFileSync('src/components/ArtistProfile.tsx', profile);

// 3. Fix Landing.tsx
let landing = fs.readFileSync('src/components/Landing.tsx', 'utf8');
landing = landing.replace(
    /const \[specialties, setSpecialties\] = useState<string\[\]>\(\['Realismo', 'Black & Grey'\]\);/g,
    "const [specialties, setSpecialties] = useState<string[]>(['Realismo', 'Black & Grey']);"
);
fs.writeFileSync('src/components/Landing.tsx', landing);

// 4. Fix DemoDashboard.tsx (Dashboard Home)
let dashboard = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// Fix default state
dashboard = dashboard.replace(/const \[specialty1, setSpecialty1\] = useState\('Blackwork'\);/, "const [specialty1, setSpecialty1] = useState('Realismo');");
dashboard = dashboard.replace(/const \[specialty2, setSpecialty2\] = useState\('Dark Realism'\);/, "const [specialty2, setSpecialty2] = useState('Black & Grey');");

// Move tags to specialties section
const headerTags = `{(() => {
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
                        })()}`;
dashboard = dashboard.replace(headerTags, "");

const specialtySection = `<div className="bg-surface-container p-6 border border-outline-variant/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl" style={{color: '#054d44'}}>military_tech</span>
                                </div>
                                <h3 className="font-headline-md text-sm font-bold uppercase tracking-widest text-on-surface">Specialties (Max 3)</h3>
                            </div>`;

const newSpecialtySection = `<div className="bg-surface-container p-6 border border-outline-variant/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl" style={{color: '#054d44'}}>military_tech</span>
                                </div>
                                <h3 className="font-headline-md text-sm font-bold uppercase tracking-widest text-on-surface">Especialidades (Max 3)</h3>
                            </div>
                            {(() => {
                                const tags = [specialty1, specialty2, specialty3].filter(Boolean);
                                if (tags.length === 0) return null;
                                const count = tags.length;
                                let containerClass = "flex mb-6 w-full justify-center ";
                                if (count === 1) containerClass += "gap-2";
                                else if (count === 2) containerClass += "gap-4";
                                else containerClass += "gap-2";
                                
                                return (
                                    <div className={containerClass}>
                                        {tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-background border border-primary font-caption text-[9px] md:text-xs text-primary uppercase tracking-widest whitespace-nowrap truncate max-w-[30%] text-center shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                );
                            })()}`;
dashboard = dashboard.replace(specialtySection, newSpecialtySection);
fs.writeFileSync('src/components/DemoDashboard.tsx', dashboard);

