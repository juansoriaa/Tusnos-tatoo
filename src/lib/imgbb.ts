export const IMGBB_API_KEY = '22584c38aaca8a18441faeb2114bb209';

const toBase64 = (file: File | Blob): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // Result is like "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
        // We only want the base64 part
        resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
});

export async function uploadToImgBB(file: File | Blob): Promise<{ url: string; thumbUrl: string }> {
    try {
        const base64Data = await toBase64(file);
        
        const formData = new FormData();
        formData.append('image', base64Data);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error?.message || 'Error uploading to ImgBB');
        }

        return {
            url: data.data.url,
            thumbUrl: data.data.thumb?.url || data.data.url,
        };
    } catch (error: any) {
        console.error('ImgBB Upload Error:', error);
        throw error;
    }
}
