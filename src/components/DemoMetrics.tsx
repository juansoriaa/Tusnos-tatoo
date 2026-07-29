import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoLayout from './DemoLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { db, auth, onAuthStateChanged } from '../firebase';
import { collection, getDocs, query, orderBy, doc, getDoc, where } from 'firebase/firestore';


export default function DemoMetrics() {
    const navigate = useNavigate();

    const [metrics, setMetrics] = useState({
        views: 0,
        photoClicks: 0,
        whatsappClicks: 0,
        agendaClicks: 0
    });

    const [animating, setAnimating] = useState(false);
    const [isDemoAccount, setIsDemoAccount] = useState(false);
    const [periodIndex, setPeriodIndex] = useState(0);
    const periods = ['day', 'week', 'month'];
    const periodLabels = { day: 'Hoy', week: 'Esta sem', month: 'Este mes' };

    useEffect(() => {
        const loadMetrics = async () => {
            let parsed = null;
            const demoUserId = localStorage.getItem('demoUserId') || auth.currentUser?.uid;
            if (demoUserId) {
                try {
                    let data = null;
                    const cacheStr = localStorage.getItem('demoArtistData_' + demoUserId);
                    if (cacheStr) {
                        data = JSON.parse(cacheStr);
                    }
                    if (!data) {
                        const docSnap = await getDoc(doc(db, 'users', demoUserId));
                    if (docSnap.exists()) {
                            data = docSnap.data();
                        }
                    }
                    if (data) {
                        if (true) {
                            parsed = {
                                views: data.views || 0,
                                whatsappClicks: data.whatsappClicks || 0,
                                agendaClicks: data.agendaClicks || 0
                            };
                        }
                    }
                } catch(e) {}
            }

            if (parsed) {
                try {
                    setMetrics(prev => {
                        if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
                            setAnimating(true);
                            setTimeout(() => setAnimating(false), 1000);
                        }
                        return { ...prev, ...parsed };
                    });
                } catch (e) {}
            }
        };
        loadMetrics();
        window.addEventListener('demoMetricsUpdated', loadMetrics);
        return () => window.removeEventListener('demoMetricsUpdated', loadMetrics);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPeriodIndex(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const currentPeriod = periods[periodIndex];

    const [showRankingModal, setShowRankingModal] = useState(false);
    

    const [topPhotos, setTopPhotos] = useState<any[]>([]);

    useEffect(() => {
        const loadPhotos = async () => {
            try {
                const demoUserId = localStorage.getItem('demoUserId') || auth.currentUser?.uid;
                if (!demoUserId) { setTopPhotos([]); return; }
                const q = query(collection(db, 'photos'), where('createdBy', '==', demoUserId));
                const snapshot = await getDocs(q);
                let dbPhotos = snapshot.docs.map(doc => ({ ...doc.data(), id: String(doc.id) } as any));
                

                let isDemoUser = false;
                if (demoUserId) {
                    let userTag = null;
                    const cacheStr = localStorage.getItem('demoArtistData_' + demoUserId);
                    if (cacheStr) {
                        userTag = JSON.parse(cacheStr).userTag;
                    } else {
                        const { doc, getDoc } = await import('firebase/firestore');
                        const userSnap = await getDoc(doc(db, 'users', demoUserId));
                    if (userSnap.exists()) {
                            userTag = userSnap.data().userTag;
                        }
                    }
                    if (userTag) {
                        const tag = userTag;
                        if (tag === '@demo' || tag === '@victor_ink' || tag === 'victor_ink' || tag === 'demo') {
                            isDemoUser = true;
                        }
                    } else if (typeof demoUserId === 'string' && demoUserId.startsWith('@')) {
                        const q = query(collection(db, 'users'), where('userTag', '==', demoUserId));
                        const snap = await getDocs(q);
                        if (!snap.empty) {
                            const tag = snap.docs[0].data().userTag;
                            if (tag === '@demo' || tag === '@victor_ink' || tag === 'victor_ink' || tag === 'demo') {
                                isDemoUser = true;
                            }
                        }
                    }
                    setIsDemoAccount(isDemoUser);
                }
                
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

                let totalPhotoClicks = 0;
                let finalPhotos = dbPhotos.map(p => {
                    const clicks = p.clicks || 0;
                    totalPhotoClicks += clicks;
                    return {
                        id: p.id,
                        imageUrl: p.thumbnailUrl || p.url || p.imageUrl || p.src,
                        title: p.title || p.tags?.[0] || 'Foto de Tatuaje',
                        category: p.category || p.tags?.[0] || 'Portfolio',
                        clicks: clicks,
                        originalFallbackId: p.originalFallbackId
                    };
                });
                setMetrics(prev => ({ ...prev, photoClicks: totalPhotoClicks }));
                
                if (isDemoUser) {
                    const limitedFallback = fallback.slice(0, 5);
                    const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                    const filteredFallback = limitedFallback.filter(f => !dbPhotos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id));
                    finalPhotos = [...finalPhotos, ...filteredFallback.map(f => ({
                        id: f.id,
                        imageUrl: f.imageUrl,
                        title: f.title,
                        category: f.category,
                        clicks: 0
                    }))];
                }
                finalPhotos.sort((a, b) => b.clicks - a.clicks);
                setTopPhotos(finalPhotos.slice(0, 10));

            } catch (e) {
                console.error(e);
            }
        };
        loadPhotos();
        window.addEventListener('photoStatsUpdated', loadPhotos);
        return () => window.removeEventListener('photoStatsUpdated', loadPhotos);
    }, []);


    const [chartMetric, setChartMetric] = useState('views');
    const [chartPeriod, setChartPeriod] = useState('week');

    const chartData = useMemo(() => {
        let data = [];
        let actualTotal = metrics[chartMetric] || 0;
        
        // For 'day', we generate 8 points. 
        // For 'week', 7 points.
        // For 'month', 10 points.
        
        if (actualTotal === 0) {
            if (chartPeriod === 'day') {
                for (let i = 8; i <= 22; i+=2) data.push({ name: `${i}:00`, value: 0 });
            } else if (chartPeriod === 'week') {
                const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                for (let i = 0; i < 7; i++) data.push({ name: days[i], value: 0 });
            } else if (chartPeriod === 'month') {
                for (let i = 1; i <= 30; i+=3) data.push({ name: `${i}`, value: 0 });
            }
            return data;
        }

        // If we have data, we divide it across the period somewhat realistically
        // We simulate a realistic distribution where the sum approximates actualTotal (or scales with it)
        const base = actualTotal;
        
        if (chartPeriod === 'day') {
            for (let i = 8; i <= 22; i+=2) {
                let multiplier = 0.02;
                if (i >= 12 && i <= 14) multiplier = 0.1;
                if (i >= 18 && i <= 20) multiplier = 0.15;
                const value = Math.floor(base * (multiplier + (Math.random() * 0.05)));
                data.push({ name: `${i}:00`, value });
            }
        } else if (chartPeriod === 'week') {
            const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
            for (let i = 0; i < 7; i++) {
                let multiplier = 0.1;
                if (i >= 4) multiplier = 0.18;
                const value = Math.floor(base * (multiplier + (Math.random() * 0.05)));
                data.push({ name: days[i], value });
            }
        } else if (chartPeriod === 'month') {
            for (let i = 1; i <= 30; i+=3) {
                const value = Math.floor((base/10) * (0.8 + (Math.random() * 0.4)));
                data.push({ name: `${i}`, value });
            }
        }
        return data;
    }, [chartMetric, chartPeriod, metrics]);

    const chartTitles = {
        views: 'Visitas Totales',
        photoClicks: 'Clicks en Fotos',
        whatsappClicks: 'Clicks en WhatsApp'
    };



    const calcIncrease = (current, periodKey, metricName) => {
        if (current === 0) return '0.0%';
        // Mock a reasonable increase based on period if we have actual data
        let factor = 0.05;
        if (periodKey === 'week') factor = 0.12;
        if (periodKey === 'month') factor = 0.25;
        
        return '+' + (factor * 100).toFixed(1) + '%';
    };

    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

    return (
        <DemoLayout 
            activeTab="metrics"
            titlePrefix="Gestión de"
            titleAccent="Métricas"
            description="Rastrea tu rendimiento, visualiza interacciones y analiza el engagement."
        >
            <div className="flex flex-col gap-6">
                {/* KPI Summary Bento Grid */}
                <section className="grid gap-4 mb-8 grid-cols-2">
                    {/* Total Views */}
                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Vistas</h3>
                            <span className="material-symbols-outlined text-primary-container text-[18px]" style={{color: '#054d44'}}>visibility</span>
                        </div>
                        <div>
                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">
                                {formatNumber(metrics.views)}
                            </p>
                            <p className={`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-all duration-500 ${animating ? 'scale-110 text-emerald-accent' : ''}`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 
                                <span className="transition-all duration-500 animate-fade-in" key={currentPeriod}>{calcIncrease(metrics.views, currentPeriod, 'views')}</span>
                                <span className="text-[9px] text-on-surface-variant ml-1 transition-all duration-500 animate-fade-in" key={`label-${currentPeriod}`}>{periodLabels[currentPeriod]}</span>
                            </p>
                        </div>
                    </div>

                    {/* Photo Clicks */}
                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Fotos</h3>
                            <span className="material-symbols-outlined text-primary-container text-[18px]" style={{color: '#054d44'}}>touch_app</span>
                        </div>
                        <div>
                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">
                                {formatNumber(metrics.photoClicks)}
                            </p>
                            <p className={`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-all duration-500 ${animating ? 'scale-110 text-emerald-accent' : ''}`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 
                                <span className="transition-all duration-500 animate-fade-in" key={currentPeriod}>{calcIncrease(metrics.photoClicks, currentPeriod, 'photoClicks')}</span>
                                <span className="text-[9px] text-on-surface-variant ml-1 transition-all duration-500 animate-fade-in" key={`label-${currentPeriod}`}>{periodLabels[currentPeriod]}</span>
                            </p>
                        </div>
                    </div>

                    {/* WhatsApp Clicks */}
                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">WhatsApp</h3>
                            <span className="material-symbols-outlined text-primary-container text-[18px]" style={{color: '#054d44'}}>chat</span>
                        </div>
                        <div>
                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">
                                {formatNumber(metrics.whatsappClicks)}
                            </p>
                            <p className={`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-all duration-500 ${animating ? 'scale-110 text-emerald-accent' : ''}`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 
                                <span className="transition-all duration-500 animate-fade-in" key={currentPeriod}>{calcIncrease(metrics.whatsappClicks, currentPeriod, 'whatsappClicks')}</span>
                                <span className="text-[9px] text-on-surface-variant ml-1 transition-all duration-500 animate-fade-in" key={`label-${currentPeriod}`}>{periodLabels[currentPeriod]}</span>
                            </p>
                        </div>
                    </div>

                    {/* Waiting List */}
                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] flex items-center gap-1">
                                Agenda
                                <div className="group relative inline-block">
                                    <span className="material-symbols-outlined text-[12px] text-on-surface-variant/50 hover:text-on-surface-variant cursor-help transition-colors">info</span>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-container-high border border-border-muted text-[10px] text-silver-text rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none text-center leading-tight normal-case font-normal" style={{backgroundColor: '#232222', borderColor: '#353434'}}>
                                        Usuarios que se agendaron exitosamente cuando la lista estaba llena.
                                    </div>
                                </div>
                            </h3>
                            <span className="material-symbols-outlined text-primary-container text-[18px]" style={{color: '#054d44'}}>queue</span>
                        </div>
                        <div>
                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">
                                {formatNumber(metrics.agendaClicks)}
                            </p>
                            <p className={`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-all duration-500 ${animating ? 'scale-110 text-emerald-accent' : ''}`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                                <span className="transition-all duration-500 animate-fade-in" key={currentPeriod}>{calcIncrease(metrics.agendaClicks, currentPeriod, 'agendaClicks')}</span>
                                <span className="text-[9px] text-on-surface-variant ml-1 transition-all duration-500 animate-fade-in" key={`label-${currentPeriod}`}>{periodLabels[currentPeriod]}</span>
                            </p>
                        </div>
                    </div>

                    {/* Conversion Rate */}
                    <div className="bg-surface-elevation border border-primary-container p-3 flex flex-col justify-between relative overflow-hidden col-span-2" style={{backgroundColor: '#141313', borderColor: '#054d44'}}>
                        <div className="absolute top-0 right-0 w-12 h-12 bg-primary-container/10 -mr-6 -mt-6 rotate-45 border-l border-b border-primary-container/30" style={{backgroundColor: 'rgba(5, 77, 68, 0.1)', borderColor: 'rgba(5, 77, 68, 0.3)'}}></div>
                        <div className="flex justify-between items-start mb-2 relative z-10">
                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] flex items-center gap-1">
                                Tasa Conversión
                                <div className="group relative inline-block">
                                    <span className="material-symbols-outlined text-[12px] text-on-surface-variant/50 hover:text-on-surface-variant cursor-help transition-colors">info</span>
                                    <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-surface-container-high border border-border-muted text-[10px] text-silver-text rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none text-left leading-tight normal-case font-normal" style={{backgroundColor: '#232222', borderColor: '#353434'}}>
                                        Porcentaje de visitas al perfil que concretaron contacto por WhatsApp o enviaron solicitud por Lista de Espera.
                                    </div>
                                </div>
                            </h3>
                            <span className="material-symbols-outlined text-primary-container text-[18px]" style={{color: '#054d44'}}>analytics</span>
                        </div>
                        <div className="relative z-10">
                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">{metrics.views > 0 ? ((metrics.whatsappClicks + metrics.agendaClicks) / metrics.views * 100).toFixed(1) + '%' : '0%'}</p>
                            <p className={`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-all duration-500 ${animating ? 'scale-110 text-emerald-accent' : ''}`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                                <span className="transition-all duration-500 animate-fade-in" key={currentPeriod}>{metrics.views > 0 ? calcIncrease(((metrics.whatsappClicks + metrics.agendaClicks) / metrics.views * 100), currentPeriod, 'conversion') : '0.0%'}</span>
                                <span className="text-[9px] text-on-surface-variant ml-1 transition-all duration-500 animate-fade-in" key={`label-${currentPeriod}`}>{periodLabels[currentPeriod]}</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Charts & Ranking Section */}
                <section className="flex flex-col gap-6 mb-8">
                    {/* Performance Chart */}
                    <div className="bg-surface-elevation border border-border-muted p-5" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        
                        {/* Header & Selectors */}
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6 border-b border-border-muted pb-4" style={{borderColor: '#353434'}}>
                            
                            {/* Metric Selector */}
                            <div className="flex items-center gap-2">
                                <div className="flex bg-surface-container-high rounded p-1 border border-border-muted" style={{backgroundColor: '#2a2a2a', borderColor: '#353434'}}>
                                    <button 
                                        onClick={() => setChartMetric('views')}
                                        className={`px-3 py-1 font-label-sm text-[10px] uppercase transition-all rounded ${chartMetric === 'views' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:text-silver-text'}`}
                                        style={chartMetric === 'views' ? {backgroundColor: '#054d44'} : {}}
                                    >
                                        Visitas
                                    </button>
                                    <button 
                                        onClick={() => setChartMetric('photoClicks')}
                                        className={`px-3 py-1 font-label-sm text-[10px] uppercase transition-all rounded ${chartMetric === 'photoClicks' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:text-silver-text'}`}
                                        style={chartMetric === 'photoClicks' ? {backgroundColor: '#054d44'} : {}}
                                    >
                                        Fotos
                                    </button>
                                    <button 
                                        onClick={() => setChartMetric('whatsappClicks')}
                                        className={`px-3 py-1 font-label-sm text-[10px] uppercase transition-all rounded ${chartMetric === 'whatsappClicks' ? 'bg-primary-container text-white' : 'text-on-surface-variant hover:text-silver-text'}`}
                                        style={chartMetric === 'whatsappClicks' ? {backgroundColor: '#054d44'} : {}}
                                    >
                                        WhatsApp
                                    </button>
                                </div>
                            </div>
                            
                            {/* Time Period Selector */}
                            <div className="flex border border-border-muted w-full md:w-auto min-w-[200px]" style={{borderColor: '#353434'}}>
                                <button 
                                    onClick={() => setChartPeriod('day')}
                                    className={`flex-1 py-1.5 font-label-sm text-label-sm uppercase active:scale-95 transition-all border-r border-border-muted text-[10px] ${chartPeriod === 'day' ? 'bg-surface-container-high text-silver-text border-b-2 border-b-primary-container' : 'bg-transparent text-on-surface-variant hover:text-silver-text'}`}
                                    style={chartPeriod === 'day' ? {backgroundColor: '#2a2a2a', borderRightColor: '#353434', borderTopColor: 'transparent', borderLeftColor: 'transparent', borderBottomColor: '#054d44'} : {borderRightColor: '#353434', borderTopColor: 'transparent', borderLeftColor: 'transparent', borderBottomColor: 'transparent'}}
                                >
                                    Día
                                </button>
                                <button 
                                    onClick={() => setChartPeriod('week')}
                                    className={`flex-1 py-1.5 font-label-sm text-label-sm uppercase active:scale-95 transition-all border-r border-border-muted text-[10px] ${chartPeriod === 'week' ? 'bg-surface-container-high text-silver-text border-b-2 border-b-primary-container' : 'bg-transparent text-on-surface-variant hover:text-silver-text'}`}
                                    style={chartPeriod === 'week' ? {backgroundColor: '#2a2a2a', borderRightColor: '#353434', borderTopColor: 'transparent', borderLeftColor: 'transparent', borderBottomColor: '#054d44'} : {borderRightColor: '#353434', borderTopColor: 'transparent', borderLeftColor: 'transparent', borderBottomColor: 'transparent'}}
                                >
                                    Sem
                                </button>
                                <button 
                                    onClick={() => setChartPeriod('month')}
                                    className={`flex-1 py-1.5 font-label-sm text-label-sm uppercase active:scale-95 transition-all text-[10px] ${chartPeriod === 'month' ? 'bg-surface-container-high text-silver-text border-b-2 border-b-primary-container' : 'bg-transparent text-on-surface-variant hover:text-silver-text'}`}
                                    style={chartPeriod === 'month' ? {backgroundColor: '#2a2a2a', borderBottomColor: '#054d44', borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent'} : {borderBottomColor: 'transparent', borderTopColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent'}}
                                >
                                    Mes
                                </button>
                            </div>
                        </div>

                        {/* Chart Title */}
                        <div className="mb-4">
                            <h3 className="font-headline-md text-headline-md text-silver-text text-xl font-bold">{chartTitles[chartMetric as keyof typeof chartTitles]}</h3>
                        </div>

                        {/* Recharts Area Chart */}
                        <div className="w-full h-64 mt-4" style={{ height: '280px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#054d44" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#054d44" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#353434" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#bfc9c5', fontSize: 10 }}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#bfc9c5', fontSize: 10 }}
                                        tickFormatter={(value) => value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#2a2a2a', borderColor: '#353434', color: '#e5e2e1', fontSize: '12px', borderRadius: '4px' }}
                                        itemStyle={{ color: '#95d2c6' }}
                                        formatter={(value) => [formatNumber(value as number), '']}
                                        labelStyle={{ color: '#bfc9c5', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#054d44" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Photo Ranking */}
                    <div className="bg-surface-elevation border border-border-muted p-5 flex flex-col h-full" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        <div className="flex justify-between items-center mb-4 border-b border-border-muted pb-4" style={{borderColor: '#353434'}}>
                            <h3 className="font-headline-md text-headline-md text-silver-text text-xl font-bold">Más Clickeadas</h3>
                            <span className="material-symbols-outlined text-on-surface-variant">trending_up</span>
                        </div>
                        <div className="flex flex-col">
                            {topPhotos.slice(0, 4).map((photo, index) => (
                                <React.Fragment key={photo.id}>
                                    <div className="flex items-center gap-3 active:bg-surface-container-high active:scale-95 transition-all py-3 cursor-pointer">
                                        <div className="font-label-md text-label-md text-on-surface-variant w-4">0{index + 1}</div>
                                        <div className="w-12 h-12 border border-border-muted flex-shrink-0 relative overflow-hidden" style={{borderColor: '#353434'}}>
                                            <img className="w-full h-full object-cover grayscale" alt={photo.title} src={photo.imageUrl}/>
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="font-body-md text-body-md text-silver-text text-sm">{photo.title}</h4>
                                            <p className="font-caption text-caption text-on-surface-variant line-clamp-1 text-xs">{photo.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-label-md text-label-md text-silver-text block text-sm">{formatNumber(photo.clicks)}</span>
                                        </div>
                                    </div>
                                    {index < 3 && <div className="h-[1px] w-full bg-border-muted/50" style={{backgroundColor: 'rgba(53, 52, 52, 0.5)'}}></div>}
                                </React.Fragment>
                            ))}
                        </div>
                        <button 
                            onClick={() => setShowRankingModal(true)}
                            className="mt-4 w-full pt-4 border-t border-border-muted text-on-surface-variant hover:text-silver-text font-label-md text-label-md active:scale-95 transition-all flex items-center justify-center gap-2" style={{borderColor: '#353434'}}
                        >
                            Ver Galería Completa <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                    </div>
                </section>
            

            {showRankingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface-elevation border border-border-muted w-full max-w-md max-h-[85vh] flex flex-col relative overflow-hidden" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        <div className="flex justify-between items-center p-5 border-b border-border-muted sticky top-0 bg-surface-elevation z-10" style={{borderColor: '#353434', backgroundColor: '#141313'}}>
                            <div>
                                <h2 className="font-headline-md text-xl font-bold text-silver-text">Top 10 Fotos</h2>
                                <p className="text-xs text-on-surface-variant mt-1">Más vistas y clics</p>
                            </div>
                            <button 
                                onClick={() => setShowRankingModal(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                            <div className="flex flex-col">
                                {topPhotos.map((photo, index) => (
                                    <React.Fragment key={photo.id}>
                                        <div className="flex items-center gap-4 hover:bg-surface-container-high transition-all py-3 px-2 rounded-sm cursor-pointer group">
                                            <div className={`font-label-md text-lg w-6 text-center font-bold ${index < 3 ? 'text-primary-container' : 'text-on-surface-variant/50'}`}>
                                                {index + 1}
                                            </div>
                                            <div className="w-16 h-16 border border-border-muted flex-shrink-0 relative overflow-hidden" style={{borderColor: '#353434'}}>
                                                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={photo.title} src={photo.imageUrl}/>
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-body-md text-silver-text text-sm font-medium">{photo.title}</h4>
                                                <p className="font-caption text-on-surface-variant line-clamp-1 text-xs mt-0.5">{photo.category}</p>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <span className="font-label-md text-silver-text text-sm font-bold">{formatNumber(photo.clicks)}</span>
                                                <span className="text-[10px] uppercase text-on-surface-variant/60 tracking-wider">Clics</span>
                                            </div>
                                        </div>
                                        {index < topPhotos.length - 1 && <div className="h-[1px] w-full bg-border-muted/30 my-1" style={{backgroundColor: 'rgba(53, 52, 52, 0.3)'}}></div>}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </DemoLayout>
    );
}
