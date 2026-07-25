import re

with open('src/components/DemoDashboard.tsx', 'r') as f:
    content = f.read()

state_injection = """
    const [pendingNav, setPendingNav] = useState<string | null>(null);

    const handleNavigate = (path: string) => {
        if (hasUnsavedChanges) {
            setPendingNav(path);
        } else {
            navigate(path);
        }
    };
"""

content = content.replace("const currentData =", state_injection + "\n    const currentData =")

# update the <DemoLayout> prop
content = content.replace("<DemoLayout \n            activeTab=\"dashboard\"", "<DemoLayout \n            onNavigate={handleNavigate}\n            activeTab=\"dashboard\"")

# Add the Unsaved Changes Modal at the very end of the component, just before the closing </div> of DemoLayout, or better, before </DemoLayout>
modal_injection = """
        {pendingNav && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-surface-container w-full max-w-sm rounded-2xl border border-outline-variant/30 p-6 flex flex-col items-center text-center shadow-2xl">
                    <span className="material-symbols-outlined text-4xl text-error mb-4">warning</span>
                    <h3 className="font-headline-md text-xl font-bold uppercase tracking-tighter mb-2">Cambios sin guardar</h3>
                    <p className="text-on-surface-variant text-sm mb-6">Si sales ahora, perderás los cambios que no hayas guardado.</p>
                    <div className="flex w-full gap-3">
                        <button 
                            onClick={() => setPendingNav(null)}
                            className="flex-1 py-3 bg-surface-variant text-on-surface uppercase text-xs font-bold tracking-widest rounded transition-colors hover:bg-surface-container-highest"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={() => {
                                setInitialDataStr(currentDataStr); // mock save to allow exit
                                navigate(pendingNav);
                            }}
                            className="flex-1 py-3 bg-error text-on-error uppercase text-xs font-bold tracking-widest rounded transition-colors hover:opacity-90"
                        >
                            Descartar
                        </button>
                    </div>
                </div>
            </div>
        )}
"""

content = content.replace("</DemoLayout>", modal_injection + "\n        </DemoLayout>")

with open('src/components/DemoDashboard.tsx', 'w') as f:
    f.write(content)

