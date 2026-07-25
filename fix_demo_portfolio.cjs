const fs = require('fs');

let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// Add isSuccess state
content = content.replace(
  "const [isSaving, setIsSaving] = useState(false);",
  "const [isSaving, setIsSaving] = useState(false);\n    const [isSuccess, setIsSuccess] = useState(false);"
);

// Replace the DOM hack with React state
content = content.replace(
  /const btn = document\.getElementById\('save-obra-btn'\);[\s\S]*?\}, 2000\);\n            \}/,
  `setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
            }, 2000);`
);

// Replace button content
const btnOld = `{isSaving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subiendo...
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined mr-2 text-[18px]">save</span>
                        Guardar Obra
                    </>
                )}`;

const btnNew = `{isSaving ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subiendo...
                    </>
                ) : isSuccess ? (
                    <>
                        <span className="material-symbols-outlined mr-2 text-[18px]">check_circle</span>
                        ¡Guardado!
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined mr-2 text-[18px]">save</span>
                        Guardar Obra
                    </>
                )}`;

content = content.replace(btnOld, btnNew);

// Adjust background styling for success
content = content.replace(
  `className="w-full bg-emerald-accent text-on-surface py-3 mt-4 rounded font-label-md uppercase tracking-widest hover:brightness-110 transition-all duration-200 flex justify-center items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"`,
  `className={\`w-full text-on-surface py-3 mt-4 rounded font-label-md uppercase tracking-widest transition-all duration-300 flex justify-center items-center text-sm \${isSuccess ? 'bg-[#10b981] scale-[1.02]' : 'bg-emerald-accent hover:brightness-110'} \${isSaving ? 'opacity-70 cursor-not-allowed' : ''}\`}`
);

content = content.replace(
  `style={{backgroundColor: '#054d44', color: '#e5e2e1'}}`,
  `style={isSuccess ? { color: '#ffffff' } : { backgroundColor: '#054d44', color: '#e5e2e1' }}`
);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
