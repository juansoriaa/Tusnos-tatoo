const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

code = code.replace(
    /const \[configPassword, setConfigPassword\] = useState\(''\);/,
    `const [configPassword, setConfigPassword] = useState('');
    const [showConfigPassword, setShowConfigPassword] = useState(false);`
);

code = code.replace(
    /<input\s*type="password"\s*value=\{configPassword\}\s*onChange=\{\(e\) => setConfigPassword\(e\.target\.value\)\}\s*placeholder="••••••••"\s*className="w-full bg-surface-container-lowest border border-outline-variant\/30 p-3 text-sm text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors rounded"\s*\/>/,
    `<div className="relative">
                                    <input 
                                        type={showConfigPassword ? "text" : "password"} 
                                        value={configPassword}
                                        onChange={(e) => setConfigPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-surface-container-lowest border border-outline-variant/30 p-3 pr-10 text-sm text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors rounded"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfigPassword(!showConfigPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-silver-text transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            {showConfigPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>`
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
