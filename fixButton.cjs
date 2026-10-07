const fs = require('fs');

// 1. Make handleSaveAll async and handle errors properly in DemoDashboard.tsx
let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

file = file.replace(
    /const handleSaveAll = \(\) => \{([\s\S]*?)const demoData = \{/m,
    `const handleSaveAll = async () => {\n        const demoData = {`
);

file = file.replace(
    /if \(demoUserId && demoUserId !== 'demo'\) \{\n\s*updateDoc\(doc\(db, 'users', demoUserId\), demoData\)\.catch\(e => console\.error\("Error saving to Firestore", e\)\);\n\s*\}\n\s*window\.dispatchEvent\(new CustomEvent\('profileDataChanged'\)\);\n\s*setInitialDataStr\(JSON\.stringify\(currentData\)\);\n\s*setHasNewUploads\(false\);\n\s*setToastMessage\("Cambios guardados exitosamente!"\);\n\s*setTimeout\(\(\) => setToastMessage\(null\), 3000\);/m,
    `try {
            setIsUploading(true);
            if (demoUserId && demoUserId !== 'demo') {
                await updateDoc(doc(db, 'users', demoUserId), demoData);
            }
            window.dispatchEvent(new CustomEvent('profileDataChanged'));
            setInitialDataStr(JSON.stringify(currentData));
            setHasNewUploads(false);
            setToastMessage("Cambios guardados exitosamente!");
        } catch (e) {
            console.error("Error saving to Firestore", e);
            alert("Error al guardar: " + (e.message || "Error desconocido"));
        } finally {
            setIsUploading(false);
            setTimeout(() => setToastMessage(null), 3000);
        }`
);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);

// 2. Add cache-busting headers to index.html
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('Cache-Control')) {
    html = html.replace(
        /<head>/,
        `<head>\n    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n    <meta http-equiv="Pragma" content="no-cache" />\n    <meta http-equiv="Expires" content="0" />`
    );
    fs.writeFileSync('index.html', html);
}

console.log('Fixed handleSaveAll and added cache-busters');
