const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const resizeFunc = `
const resizeImage = (file: File, maxDim: number = 1024): Promise<File> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            let width = img.width;
            let height = img.height;
            if (width > maxDim || height > maxDim) {
                if (width > height) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                } else {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(new File([blob], file.name || 'image.jpg', { type: 'image/jpeg' }));
                } else {
                    resolve(file);
                }
            }, 'image/jpeg', 0.85);
        };
        img.onerror = () => resolve(file);
        img.src = URL.createObjectURL(file);
    });
};
`;

// Insert resize function at the top of the component
file = file.replace(/export default function DemoDashboard\(\) \{/, 'export default function DemoDashboard() {\n' + resizeFunc);

// Update handleFileUpload to use resizeImage
const newHandleUpload = `    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrl: React.Dispatch<React.SetStateAction<string>>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            try {
                const resizedFile = await resizeImage(file, type === 'banner' ? 1920 : 800);
                const imgbbRes = await uploadToImgBB(resizedFile);
                setUrl(imgbbRes.url);
            } catch (err: any) {
                console.error('Error al subir la imagen:', err);
                alert('Error de conexión al subir la imagen (Failed to fetch).\\n\\nSi usas un bloqueador de anuncios (AdBlock, uBlock, Brave Shields), por favor desactívalo temporalmente para esta página, ya que suelen bloquear las subidas de imágenes.');
            } finally {
                setIsUploading(false);
            }
        }
    };`;

file = file.replace(/const handleFileUpload = async[\s\S]*?setIsUploading\(false\);\s*\}\s*\}\s*;/m, newHandleUpload);

// Remove the obsolete 10MB alert check since we're resizing anyway
file = file.replace(/if \(file\.size > 10 \* 1024 \* 1024\) \{[\s\S]*?return;\s*\}/, '');

fs.writeFileSync('src/components/DemoDashboard.tsx', file);
console.log('Patched DemoDashboard with resize logic!');
