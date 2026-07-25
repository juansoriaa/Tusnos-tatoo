const fs = require('fs');
let content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

const useFirebase = `
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
`;

content = content.replace(/import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';/, "import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';\n" + useFirebase);


const loadRealTopPhotos = `
    const [topPhotos, setTopPhotos] = useState<any[]>([]);

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const dbPhotos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
                
                const fallback = [
                    {
                      id: "fallback_1",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ",
                      title: "Lion Forearm", category: "Black & Grey Realism"
                    },
                    {
                      id: "fallback_2",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5DDAAcFYiq49hBeVBI21d-Kfzr6qKoiRfIXKP1UnRW7YF5GJFA5MFkoXHtdBxy6uEbgH9z0zVWPWxKIEtX3oXemICFI1Ssr7FZ-Hh_OVDjHQ-QLRxMXBp5c4FwHXswrbPE9ZdzVelcUFL0h0nTLuzuWpLR_QRaZBZsyq7srBJaHktN6PcAYY-NQ2d-8FRg_RJ15MYhPUfdaEk_oGzE57hWrd7ZFkT4ldOW1tTIz0PqCqzo5_ALKPhXP1byoz8eiIEM30X9HQLzho",
                      title: "Minimalist Rose", category: "Fine Line"
                    },
                    {
                      id: "fallback_3",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA",
                      title: "Full Back", category: "Blackwork"
                    },
                    {
                      id: "fallback_4",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYd_bLleuw4yQOy32XLTc-ZA36ZI1Tx20UNajjWgcV5DQKPXzxE6vuXBvD3Ov7hcyCDB0Wpbc1BK7v4CJMIFC3KWS1bBdxzGJUcjSraTSohPMSOjESD5If5O8I8ZxmV0rWCZ_T_ncpPVYMBz9OD9_NXcCjwNkftJNjmowLcbK_jq3Fy-FieRJHky4A0G8SWmDSNGfDrlvoUxmb8aYt9Dxvi2w5uLOR4ir0BxgO2Sh5IfSstId4FI96uowW3Y1Jw1YCCRUk82ep4yPk",
                      title: "Hyper-realistic", category: "Realism"
                    },
                    {
                      id: "fallback_5",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5LMtrwwTSFu95uiU0bVfXq9VmWZIJ10dyJ3Lwbu6VmGCGEnBfZXi0WQlrXz0JAAAXzBurYTXa8IleL_Z1UTW7x4BHigWcVZCarsYy-PDu3G5JOwCsz3c0mgBTVI90e2b4bcw5lLDYzc5mU0qXptlWkjo0e3ynOS0xxfhCjxtvA0Bykbfo3wSX79T_fwcMg4uFHYXGxws2NYoOaKhhgr6J8ErFHQqB5QJSnK9c2zkwmEgiIM-74wbPKlVjQPO8pxETkDa8jrj1OmA",
                      title: "Owl", category: "Blackwork"
                    },
                    {
                      id: "fallback_6",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiCcgze-zMmmFAOjCN4xQ6CeoqLv_BgkKj7iZWfDqCXh_QoGPCTeSVYBVbA3H_kloM0bS3tXxBa3cY1pNmeNr4CtKPuWY_AFMUCkSb29fVkPS2cJxnOnCZXdCOsST5XxUvicao5fv4hZLXgol8izTusYUx7vRcLz4wQi2YO2jqeWtkjahkSIkJ9bsZTT9Yc4B7Xyxsbuht5vClIiVLFRgAVTnmtfvKmMPDtXdGMokCs42r9vRajXl7r_QmrmtosOLgBWwvZeva_eLj",
                      title: "Mountain", category: "Minimalist"
                    },
                    {
                      id: "fallback_7",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4kAzmGiitSjdk2D4_OGK9WYclBZmk7cefWe8BPMcY8LBacqpcoUc38Awd5FqNh4Eba1D7004xOI8zM_OfSwqcVZtS51XTNjE110SdiB0YMIgxjjBiNGxIGDifU-2yV2DRHxJyft8AS6K6D8tdWl2VVOQfu7wbFLEt11twfKV6pV5KYEwWElAna9GN2J36mCgbidD9hs4hjuPVR45M0Pps7tijbmPhi-RljtyBBrI8SYhiXDvFxXBFVQP1eN6iXqLAzNKsTq_SVt3I",
                      title: "Koi Fish", category: "Realistic"
                    },
                    {
                      id: "fallback_8",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeiQ96QvK_CB1f544ltSr7zUBzrf2JkPLOlygIBhVzlG8_X5vs1kq9-qAOcPYyPpmhMJ1zn9Tcmc7NtA_i3PYk36Iz_1F__r0TDyBqJSggpzoN5zrF7-cvpX9b6WXiYVcfeoqEuaJYzdSoe8kUbhd0B4xu4PGqI41o9CycgDPQVit7QtUNuxbu8VjI8LNqibJ2Qpoa09qjNLV4Jo2vA81r1KdlIAW9YBEaay9duZ3ZH7HaFAD81admkcERAH-uJz-36mHQSAIx-9Eb",
                      title: "Pocket Watch", category: "Micro-realism"
                    },
                    {
                      id: "fallback_9",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq1VnZZF7nLUADCQTiQU7dFsZs6g49GFftf-8vLI5Eht2qRTRatf1CSOeX5KEYDypiRNGBkOf_c2xFWSl0jIvxnDMDACEPe9flYK5v_8YXNAZsg1vf9sU4ErKlOyti57hRTbY2bE0gaC06B9DTveMjFNKECVQukrTC9VKQib6kXWcVETRdRFmdCUJdFtzLRk4Dnc1UmNwEx2kNBrXTze-GZPlY4FY-H1oaaAh6UzJLZKz8EHc8jTj761A7z6b_CVlSjqiWdBYTjuCS",
                      title: "Geometric", category: "Abstract"
                    },
                    {
                      id: "fallback_10",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhMj-R1FS_ht2tgrQqme6b2-Hg846oZVQyQ8p1Rchy_7azS2BnqJ5ysLJC8ekDsqqJ8r8LVqJy7K0vGLwO3JKB2uZz_KP8CkOCEmoJ8VMPaUL6cRZryKuQ6HnyRnPdwZ1Qjl2e9IwAs2V3gj-qNn3VIs25WmVqhxfKa7qTsFCOZujgAJV7F3Sot0QO3TJ23bSoB7cpiXHeyHfC00e9Z2qW6y_9DnVNd3R4U30ZGgtAdmqv9-xhzzVl6qAEs0focdc8_W14OXWEfcFu",
                      title: "Script", category: "Elegant"
                    },
                    {
                      id: "fallback_11",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeHO5mvih_r7YM-AQGfl6iWFA1d3CbUokk5zQ4HXbH3KTIJGeDLkdA-9tQrC1005dLiu4B2NyIL87-Y2DeE-B2IaiAIAPscoi7yJyYW7p5C1BPnRQPAcrbpxuDExdI3Xp8j__iKVjs1sqqpCXXVAVzm8PpbbFoPB7ca91f2keDdXcwyQz10d28H_44u4UwZFaPaQzuS6lKDiS77IZ05qxOyMiiwJd0D48vNuQQqLxWFA4X67UB_J03NSR6pFTMBXwwJWUIXU-RHbwf",
                      title: "Landscape", category: "Diamond"
                    },
                    {
                      id: "fallback_12",
                      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_jhISTzGUC2siSj7XIqc-tB7Bzph9Pa50g881aLp9acURUaH40UfWqwlaPN8vl_o5GGNJwNHZFFRzpVpoVffXojuHdynlpn4l8usek3UlfDg4f2TZsxxNPWV8Iqm6jgpbW3-TnVjiwYzCzrj_Htjt1I3iffZTFCM68lixk6Oz4Jml38mAv0HpdJWGJaSe1Y8Img_4dzl_iPZkU9_WaeA0xH6i2x-1XthcwczFtCWa1ScOMF05bFoWQ7OSotfbDwUlQeZrcGO8bjT7",
                      title: "Dagger", category: "Neo-traditional"
                    }
                ];

                const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                const finalPhotos = [
                    ...dbPhotos.map(p => ({
                        id: p.id,
                        imageUrl: p.imageUrl || p.src,
                        title: p.title || 'Foto de Tatuaje',
                        category: p.category || 'Portfolio'
                    })),
                    ...fallback.filter(f => !dbPhotos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id))
                ];

                const stats = JSON.parse(localStorage.getItem('photoStats') || '{}');
                
                const photosWithStats = finalPhotos.map(photo => ({
                    ...photo,
                    clicks: stats[photo.id] || Math.floor(Math.random() * 50) + 10 // Mock clicks if no real stats yet
                }));

                photosWithStats.sort((a, b) => b.clicks - a.clicks);
                setTopPhotos(photosWithStats.slice(0, 10));

            } catch (e) {
                console.error(e);
            }
        };
        loadPhotos();
        window.addEventListener('photoStatsUpdated', loadPhotos);
        return () => window.removeEventListener('photoStatsUpdated', loadPhotos);
    }, []);
`;

// Remove the hardcoded topPhotos array and replace with the effect
const arrayRegex = /    const topPhotos = \[\s*\{\s*id: 1,[\s\S]*?\}\s*\];/;
content = content.replace(arrayRegex, loadRealTopPhotos);

fs.writeFileSync('src/components/DemoMetrics.tsx', content);
