const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

code = code.replace(
    /<header className="hidden md:flex h-16 justify-between items-center px-8 bg-surface-elevation\/80 backdrop-blur-md sticky top-0 z-40 border-b border-border-muted" style=\{\{backgroundColor: 'rgba\\(20, 19, 19, 0\.8\\)', borderColor: '#353434'\}\}>\s*<div>\s*<h2 className="font-headline-md text-on-surface hidden">Turnos Tattoo<\/h2>\s*<\/div>\s*<div className="flex items-center space-x-6">\s*<button onClick=\{\(\) => handleNav\(currentUserTag \? '\/' \+ \(currentUserTag\.startsWith\('@'\) \? currentUserTag : '@' \+ currentUserTag\) : '\/demo\/profile'\)\} className="text-\[10px\] font-bold uppercase tracking-widest text-emerald-accent bg-surface-variant px-4 py-2 rounded-full hover:bg-emerald-accent\/10 border border-emerald-accent transition-all" style=\{\{borderColor: '#054d44', color: '#054d44'\}\}>\s*Ver Perfil\s*<\/button>\s*<button className="text-on-surface-variant hover:text-primary transition-all active:scale-95" title="Cambiar estilo">\s*<span className="material-symbols-outlined">palette<\/span>\s*<\/button>\s*<button className="text-on-surface-variant hover:text-primary transition-all active:scale-95 relative" onClick=\{\(\) => setIsNotificationsOpen\(true\)\}>\s*<span className="material-symbols-outlined">notifications<\/span>\s*\{unreadCount > 0 && \(\s*<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-\[10px\] text-on-error font-bold z-10">\s*\{unreadCount\}\s*<\/span>\s*\)\}\s*<\/button>\s*<\/div>\s*<\/header>/,
    `<header className="hidden md:flex h-16 items-center px-8 bg-surface-elevation/80 backdrop-blur-md sticky top-0 z-40 border-b border-border-muted" style={{backgroundColor: 'rgba(20, 19, 19, 0.8)', borderColor: '#353434'}}>
                    <div className="flex-1"></div>
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <button onClick={() => handleNav(currentUserTag ? '/' + (currentUserTag.startsWith('@') ? currentUserTag : '@' + currentUserTag) : '/demo/profile')} className="text-[10px] font-bold uppercase tracking-widest text-emerald-accent bg-surface-variant px-6 py-2 rounded-full hover:bg-emerald-accent/10 border border-emerald-accent transition-all shadow-[0_0_15px_rgba(5,77,68,0.2)]" style={{borderColor: '#054d44', color: '#054d44'}}>
                            Ver Perfil
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-end space-x-6">
                        <button className="text-on-surface-variant hover:text-primary transition-all active:scale-95" title="Cambiar estilo">
                            <span className="material-symbols-outlined">palette</span>
                        </button>
                        <button className="text-on-surface-variant hover:text-primary transition-all active:scale-95 relative" onClick={() => setIsNotificationsOpen(true)}>
                            <span className="material-symbols-outlined">notifications</span>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-on-error font-bold z-10">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </header>`
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
