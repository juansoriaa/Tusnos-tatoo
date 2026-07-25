const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const confirmModalHtml = `
            {showCancelConfirm && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
                    <div className="bg-surface-container border border-outline-variant w-full max-w-sm p-6 relative flex flex-col gap-4 overflow-hidden rounded-lg">
                        <h3 className="text-white text-lg font-bold">¿Cancelar edición?</h3>
                        <p className="text-on-surface-variant text-sm">Hiciste cambios sin guardar. Si cancelas ahora, esos cambios se perderán.</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={() => setShowCancelConfirm(false)} className="px-4 py-2 text-sm text-silver-text hover:text-white transition-colors">Volver</button>
                            <button onClick={cancelEdit} className="px-4 py-2 text-sm bg-[#b91c1c] text-white rounded hover:bg-[#991b1b] transition-colors">Sí, cancelar</button>
                        </div>
                    </div>
                </div>
            )}
`;

content = content.replace(
  '</DemoLayout>',
  confirmModalHtml + '\n            </DemoLayout>'
);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
