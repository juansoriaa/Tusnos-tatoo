import re

with open('full_dash.txt', 'r') as f:
    content = f.read()

# 1. Add `hasUnsavedChanges` and `initialDataStr` logic.
# Find `const [metrics, setMetrics] = useState({`
state_injection = """
    const [initialDataStr, setInitialDataStr] = useState('');

    const currentData = {
        name, bio, specialty1, specialty2, specialty3, isAvailable,
        whatsapp, instagram, facebook, tiktok, avatarUrl, bannerUrl,
        hasPhysicalStudio, studioName, studioDescription, studioAddress, studioHours, mapLink, faqs
    };
    const currentDataStr = JSON.stringify(currentData);
    const hasUnsavedChanges = initialDataStr !== '' && currentDataStr !== initialDataStr;

    const handleSaveAll = () => {
        const demoData = {
            displayName: name,
            bio: bio,
            specialtyTags: [specialty1, specialty2, specialty3].filter(Boolean),
            isAvailable: isAvailable,
            whatsapp: whatsapp,
            instagram: instagram,
            facebook: facebook,
            tiktok: tiktok,
            mapLink: mapLink,
            hasPhysicalStudio: hasPhysicalStudio,
            studioName: studioName,
            studioDescription: studioDescription,
            studioAddress: studioAddress,
            studioHours: studioHours,
            profilePhotoUrl: avatarUrl,
            backgroundPhotos: [bannerUrl],
            faqs: faqs
        };
        localStorage.setItem('demoArtistData_demo', JSON.stringify(demoData));
        window.dispatchEvent(new CustomEvent('profileDataChanged'));
        setInitialDataStr(JSON.stringify(currentData));
        alert("Cambios guardados exitosamente!");
    };

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);
"""
content = content.replace("const [metrics, setMetrics] = useState({", state_injection + "\n    const [metrics, setMetrics] = useState({")

# 2. Update the useEffect that loads data
load_effect_regex = r"useEffect\(\(\) => \{\s*const saved = localStorage\.getItem\('demoArtistData_demo'\);\s*if \(saved\) \{\s*try \{([\s\S]*?)\} catch \(e\) \{\}\s*\}\s*\}, \[\]\);"
def load_effect_replace(match):
    body = match.group(1)
    # append setInitialDataStr
    return """useEffect(() => {
        const saved = localStorage.getItem('demoArtistData_demo');
        if (saved) {
            try {
""" + body + """
                setInitialDataStr(JSON.stringify({
                    name: data.displayName || 'Victor Ink',
                    bio: data.bio || 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.',
                    specialty1: (data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[0] || '') : 'Realismo',
                    specialty2: (data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[1] || '') : 'Black & Grey',
                    specialty3: data.specialtyTags?.[2] || '',
                    isAvailable: data.isAvailable !== false,
                    whatsapp: data.whatsapp || '',
                    instagram: data.instagram || '',
                    facebook: data.facebook || '',
                    tiktok: data.tiktok || '',
                    avatarUrl: data.profilePhotoUrl || defaultAvatar,
                    bannerUrl: (data.backgroundPhotos && data.backgroundPhotos.length > 0) ? data.backgroundPhotos[0] : defaultBanner,
                    hasPhysicalStudio: data.hasPhysicalStudio !== false,
                    studioName: data.studioName || '',
                    studioDescription: data.studioDescription || '',
                    studioAddress: data.studioAddress || '',
                    studioHours: data.studioHours || '',
                    mapLink: data.mapLink || '',
                    faqs: data.faqs || defaultFaqs
                }));
            } catch (e) {}
        } else {
            setInitialDataStr(JSON.stringify({
                name: 'Victor Ink',
                bio: 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.',
                specialty1: 'Realismo',
                specialty2: 'Black & Grey',
                specialty3: '',
                isAvailable: true,
                whatsapp: '',
                instagram: '',
                facebook: '',
                tiktok: '',
                avatarUrl: defaultAvatar,
                bannerUrl: defaultBanner,
                hasPhysicalStudio: true,
                studioName: '',
                studioDescription: '',
                studioAddress: '',
                studioHours: '',
                mapLink: '',
                faqs: defaultFaqs
            }));
        }
    }, []);"""

content = re.sub(load_effect_regex, load_effect_replace, content)

# 3. Remove old save buttons and functions
content = re.sub(r"const handleSaveFaqs = \(\) => \{[\s\S]*?\};", "", content)

# Remove Save Cambios button block
save_cambios_btn = r"<div className=\"mt-8\">\s*<button className=\"w-full py-3 text-white font-label-md text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95\" style=\{\{backgroundColor: '#054d44', boxShadow: '0 0 15px rgba\(5, 77, 68, 0\.4\)'\}\} onClick=\{\(\) => \{[\s\S]*?Guardar Cambios\s*</button>\s*</div>"
content = re.sub(save_cambios_btn, "", content)

# Remove Save FAQs button block
save_faqs_btn = r"<button\s*onClick=\{handleSaveFaqs\}[\s\S]*?Guardar FAQs\s*</button>"
content = re.sub(save_faqs_btn, "", content)

# 4. Inject floating save button
fab = """
        {hasUnsavedChanges && (
            <button 
                onClick={handleSaveAll}
                className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-[100] w-14 h-14 rounded-full bg-emerald-accent text-on-primary flex items-center justify-center shadow-[0_0_20px_rgba(5,77,68,0.6)] hover:scale-110 active:scale-95 transition-all animate-bounce-slow"
                style={{backgroundColor: '#054d44'}}
                title="Guardar todos los cambios"
            >
                <span className="material-symbols-outlined text-2xl">save</span>
            </button>
        )}
"""

# Place it right before </DemoLayout>
content = content.replace("</DemoLayout>", fab + "\n        </DemoLayout>")

# 5. Fix navigation warning in DemoLayout intercepting (optional, maybe we just export hasUnsavedChanges if we use context. 
# But here we can just intercept local links by passing it down or rendering a modal inside DemoDashboard for back buttons.
# Since DemoLayout handles the navbar, it's hard to intercept its links without modifying DemoLayout.
# Let's pass hasUnsavedChanges to DemoLayout if it takes it, or just leave BeforeUnload (which covers reload/close). 
# For react-router navigation, since it's a SPA, beforeunload doesn't fire.
# A simple way to intercept in a SPA is to render a custom invisible overlay on top of links? No.

with open('src/components/DemoDashboard.tsx', 'w') as f:
    f.write(content)

