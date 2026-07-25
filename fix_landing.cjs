const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const targetImports = "import React from 'react';";
const newImports = "import React, { useEffect, useState } from 'react';";
content = content.replace(targetImports, newImports);

const targetComp = "export default function Landing() {";
const newComp = `export default function Landing() {
  const [artistName, setArtistName] = useState('Victor Ink');
  const [specialties, setSpecialties] = useState<string[]>(['Realismo', 'Black & Grey']);

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('demoArtistData');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.displayName) setArtistName(data.displayName);
          if (data.specialtyTags && data.specialtyTags.length > 0) setSpecialties(data.specialtyTags);
        } catch(e) {}
      }
    };
    
    loadData();
    window.addEventListener('profileDataChanged', loadData);
    return () => window.removeEventListener('profileDataChanged', loadData);
  }, []);`;
content = content.replace(targetComp, newComp);

const targetName = `<h3 className="font-display-lg text-2xl uppercase tracking-widest text-white mb-1">Victor Ink</h3>`;
const newName = `<h3 className="font-display-lg text-2xl uppercase tracking-widest text-white mb-1">{artistName}</h3>`;
content = content.replace(targetName, newName);

const targetTags = `<div className="flex gap-2 mb-6">
                      <span className="px-3 py-1 border border-primary text-[8px] uppercase tracking-wider text-white rounded-full">Realismo</span>
                      <span className="px-3 py-1 border border-primary text-[8px] uppercase tracking-wider text-white rounded-full">Black & Grey</span>
                    </div>`;

const newTags = `{(() => {
                      const tags = specialties;
                      const count = tags.length;
                      let containerClass = "flex mb-6 ";
                      if (count === 1) containerClass += "gap-2 justify-center";
                      else if (count === 2) containerClass += "gap-2 justify-center";
                      else containerClass += "gap-2 justify-center";
                      
                      return (
                        <div className={containerClass}>
                          {tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="px-3 py-1 border border-primary text-[8px] uppercase tracking-wider text-white rounded-full truncate max-w-[120px]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      );
                    })()}`;

content = content.replace(targetTags, newTags);
fs.writeFileSync('src/components/Landing.tsx', content);

