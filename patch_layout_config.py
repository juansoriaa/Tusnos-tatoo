import re

with open('src/components/DemoLayout.tsx', 'r') as f:
    content = f.read()

# Add Firestore imports
if "doc" not in content:
    content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\nimport { doc, getDoc, updateDoc } from 'firebase/firestore';\nimport { db } from '../firebase';")

# Add state variables
state_regex = r"const \[isConfigModalOpen, setIsConfigModalOpen\] = useState\(false\);"
state_replacement = """const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [configEmail, setConfigEmail] = useState('');
    const [configPassword, setConfigPassword] = useState('');"""
content = re.sub(state_regex, state_replacement, content)

# Add useEffect for fetching user data
useEffect_regex = r"useEffect\(\(\) => \{\n        const handleStatus = \(e\) => \{"
useEffect_replacement = """useEffect(() => {
        const fetchDemoUser = async () => {
            const demoUserId = localStorage.getItem('demoUserId');
            if (demoUserId) {
                try {
                    const docSnap = await getDoc(doc(db, 'users', demoUserId));
                    if (docSnap.exists()) {
                        setConfigEmail(docSnap.data().email || '');
                    }
                } catch (e) {
                    console.error("Error fetching demo user config", e);
                }
            }
        };
        fetchDemoUser();
    }, []);

    const handleSaveConfig = async () => {
        const demoUserId = localStorage.getItem('demoUserId');
        if (!demoUserId) {
            alert('No se pudo identificar el usuario de la demo.');
            return;
        }

        try {
            const updates: any = {};
            if (configEmail.trim()) updates.email = configEmail.trim();
            if (configPassword.trim()) updates.customPassword = configPassword.trim();

            if (Object.keys(updates).length > 0) {
                await updateDoc(doc(db, 'users', demoUserId), updates);
                alert('Configuración guardada exitosamente');
                setConfigPassword(''); // Clear password field after saving
            } else {
                alert('No hay cambios para guardar.');
            }
            setIsConfigModalOpen(false);
        } catch (error) {
            console.error("Error saving config", error);
            alert('Error al guardar la configuración');
        }
    };

    useEffect(() => {
        const handleStatus = (e: any) => {"""
content = re.sub(useEffect_regex, useEffect_replacement, content)

# Replace Modal contents
modal_content_regex = r"<input \s*type=\"email\" \s*placeholder=\"correo@ejemplo\.com\"\s*className=\"[^\"]*\"\s*/>"
modal_content_replacement = """<input 
                                    type="email" 
                                    value={configEmail}
                                    onChange={(e) => setConfigEmail(e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    className="w-full bg-surface-container-lowest border border-outline-variant/30 p-3 text-sm text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors rounded"
                                />"""
content = re.sub(modal_content_regex, modal_content_replacement, content)

modal_pwd_regex = r"<input \s*type=\"password\" \s*placeholder=\"••••••••\"\s*className=\"[^\"]*\"\s*/>"
modal_pwd_replacement = """<input 
                                    type="password" 
                                    value={configPassword}
                                    onChange={(e) => setConfigPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-surface-container-lowest border border-outline-variant/30 p-3 text-sm text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors rounded"
                                />"""
content = re.sub(modal_pwd_regex, modal_pwd_replacement, content)


save_btn_regex = r"onClick=\{\(\) => \{\s*alert\('Configuración guardada exitosamente'\);\s*setIsConfigModalOpen\(false\);\s*\}\}"
content = re.sub(save_btn_regex, "onClick={handleSaveConfig}", content)

with open('src/components/DemoLayout.tsx', 'w') as f:
    f.write(content)

