const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const targetTags = `{(() => {
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

const newTags = `{(() => {
                      const tags = specialties;
                      const count = tags.length;
                      let containerClass = "flex mb-6 w-full px-2 justify-center ";
                      if (count === 1) containerClass += "gap-2";
                      else if (count === 2) containerClass += "gap-4";
                      else containerClass += "gap-2";
                      
                      return (
                        <div className={containerClass}>
                          {tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 border border-primary text-[8px] uppercase tracking-wider text-white rounded-full truncate max-w-[30%] text-center">
                              {tag}
                            </span>
                          ))}
                        </div>
                      );
                    })()}`;

content = content.replace(targetTags, newTags);
fs.writeFileSync('src/components/Landing.tsx', content);

