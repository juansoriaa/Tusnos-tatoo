export const IMGBB_API_KEY = '22584c38aaca8a18441faeb2114bb209';

export async function uploadToImgBB(file: File): Promise<{ url: string; thumbUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    try {
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
    } catch (error) {
        console.error('ImgBB Upload Error:', error);
        throw error;
    }
}
