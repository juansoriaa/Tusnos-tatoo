const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

const targetStr = `                  {blogTarget === 'specific' && (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                      <label className="font-label-md text-label-md text-secondary">Email del Usuario</label>
                      <input 
                        type="email" 
                        placeholder="usuario@ejemplo.com" 
                        value={blogSpecificUser}
                        onChange={(e) => setBlogSpecificUser(e.target.value)}
                        className="w-full bg-deep-black border border-outline-variant/50 rounded p-3 text-on-surface focus:outline-none focus:border-primary transition-all"
                        required
                      />
                    </div>
                  )}`;

const replaceStr = `                  {blogTarget === 'specific' && (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                      <label className="font-label-md text-label-md text-secondary">Nombre o Usuario</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Juan Pérez o @juanp" 
                        value={blogSpecificUser}
                        onChange={(e) => setBlogSpecificUser(e.target.value)}
                        className="w-full bg-deep-black border border-outline-variant/50 rounded p-3 text-on-surface focus:outline-none focus:border-primary transition-all"
                        required
                      />
                    </div>
                  )}`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('src/components/SuperAdmin.tsx', content);
