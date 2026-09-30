const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const oldHandleUpload = `    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrl: React.Dispatch<React.SetStateAction<string>>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            
            setIsUploading(true);
            try {
                const imgbbRes = await uploadToImgBB(file);
                setUrl(imgbbRes.url);`;

const newHandleUpload = `    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrl: React.Dispatch<React.SetStateAction<string>>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            try {
                const resizedFile = await resizeImage(file, type === 'banner' ? 1920 : 800);
                const imgbbRes = await uploadToImgBB(resizedFile);
                setUrl(imgbbRes.url);`;

file = file.replace(oldHandleUpload, newHandleUpload);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);
console.log('Fixed handleFileUpload in DemoDashboard!');
