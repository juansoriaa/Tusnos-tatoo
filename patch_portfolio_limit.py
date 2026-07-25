import re

with open('src/components/DemoPortfolio.tsx', 'r') as f:
    content = f.read()

target = r"const handleSaveObra = async \(\) => \{\n        if \(\!selectedFile && \!editingPhoto\) \{"
replacement = """const handleSaveObra = async () => {
        if (!editingPhoto && existingPhotos.length >= 25) {
            alert('Has alcanzado el límite máximo de 25 obras. Por favor, elimina algunas antes de subir más.');
            return;
        }
        if (!selectedFile && !editingPhoto) {"""

content = re.sub(target, replacement, content)

with open('src/components/DemoPortfolio.tsx', 'w') as f:
    f.write(content)

