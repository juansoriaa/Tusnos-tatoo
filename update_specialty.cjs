const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `<div className="flex flex-wrap justify-center gap-2 mb-4">
            {artistData?.specialtyTags ? artistData.specialtyTags.map((tag: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-surface-container border border-outline-variant font-caption text-caption text-on-surface-variant uppercase tracking-widest">{tag}</span>
            )) : (
              <>
                <span className="px-3 py-1 bg-surface-container border border-outline-variant font-caption text-caption text-on-surface-variant uppercase tracking-widest">REALISMO BLACK</span>
                <span className="px-3 py-1 bg-surface-container border border-outline-variant font-caption text-caption text-on-surface-variant uppercase tracking-widest">GREY</span>
                <span className="px-3 py-1 bg-surface-container border border-outline-variant font-caption text-caption text-on-surface-variant uppercase tracking-widest">MINIMALISTA</span>
              </>
            )}
          </div>`;

const replace = `
          {(() => {
            const tags = artistData?.specialtyTags || ['BLACKWORK', 'DARK REALISM'];
            const count = tags.length;
            let containerClass = "flex justify-center mb-4 w-full px-2 md:px-4 ";
            if (count === 1) containerClass += "gap-2";
            else if (count === 2) containerClass += "gap-6 md:gap-8";
            else containerClass += "gap-2 justify-between md:justify-center md:gap-4";
            
            return (
              <div className={containerClass}>
                {tags.map((tag: string, index: number) => (
                  <span key={index} className="px-2 py-1 md:px-3 md:py-1 bg-surface-container border border-outline-variant font-caption text-[9px] md:text-xs text-on-surface-variant uppercase tracking-widest whitespace-nowrap truncate max-w-[32%] md:max-w-none text-center flex-1 md:flex-none">
                    {tag}
                  </span>
                ))}
              </div>
            );
          })()}
`;

content = content.replace(target, replace.trim());
fs.writeFileSync('src/components/ArtistProfile.tsx', content);

