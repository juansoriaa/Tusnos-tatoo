const fs = require('fs');

let content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

const modalState = `    const [showRankingModal, setShowRankingModal] = useState(false);
    
    const topPhotos = [
        {
            id: 1,
            title: "Skull & Roses",
            category: "Black & Grey Arm Sleeve",
            clicks: 1240,
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9uMge5D-apphbR35e4xHc66ca2zbvf7_EHq_8hGYp4BUkQ6tBw_lTHN7xzolxHnTth33N2fcGXu6aHvPiEOuHMs82plA9rA4HIEMd1Ma19K7KZNv-ddX4SOlST3m17V2hjKQOIyOAmuuKslls4AL1_AjCxdIZBcgazYnc0ywl2NgU7wyd5b038WWZADpvV0oYAC7zdo0kJd7JfJ_VTi0r3EUVUYP8usGDYiFsJRBTxA3pEQcE7FnMHQoAuZAIpAM6xgbthJSPTL8"
        },
        {
            id: 2,
            title: "Geo Mandala",
            category: "Dotwork Shoulder",
            clicks: 845,
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4IgJJhniGD9b90OTukKuRirxpAxX79QvQjffSIWD_jZPIX86E02aSbPGD_ls5qXSATQ7deLYUedd7cH-JCVDsKDZfggFhyRjkImbv8k-rAJxO1MfJf4rQ1-Nx1gB-QIZIYqTa_ubiv9qUeQV81S9PjINBqyg_qU6hzv0vqltH8OQYgMi_nbD2pRoutPfFlzRyKn2HU5xMp5TRLIQEZ0DkSLvNOlKsoQQSplpCxBJJxMqHt8EvDGcQDCwgPLQ_wF5dHNvTMOv9sGw"
        },
        {
            id: 3,
            title: "Trad Panther",
            category: "American Trad Calf",
            clicks: 612,
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyMD9L5r44IqSP2MdCWm9iHsyNU7IAW6N-jekGY9rsxCGxjqLGOewtriFXc-Gd-JjcPHUriSI4Ppmof99WncWwjCcdtFezQ4f8aHlaGgQv1nlsc1yK8MwKbjHmE3diW_1C3RpE20F4Bc8qOoLY1MWrKM7fGSbw5urlenXW4a5sf8sV-Orpp77CsmmggBK0e4RyQgAfxzqLd_mPftGlqOL_xIY4QUlbext-64O-8i1FgRITMYFoLlZ7Qs4RFRX4ZTfeKYGpOJ5eeKI"
        },
        {
            id: 4,
            title: "Abstract Flow",
            category: "Fine Line Ribs",
            clicks: 498,
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA50Ao1o2k-kqVgN-XE3SDK9U56jyalx5q1vc6cnyhR6NGM52e1lIcmqHvtNzQQxy5Wz0isfTypwgwsfgrM73jCwA2Ie2tajFcl1OETPUw3nsCZEiY2i01dycIIkzeg-vhfTACIMueyPf6XQboy7OZLKdQXrP8Pf0OGoWxBu4JQPxVttNp7EF6PvlyfKh6rcTzCwmVfqLlWK5x5sAY2p7LZB18LuyxOYLk6Acs0YXxnWAk9ZKbRaZNYhSbpZ0eQTmpNXgp45djg_y0"
        },
        {
            id: 5,
            title: "Neo Japanese Dragon",
            category: "Full Back Piece",
            clicks: 432,
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9uMge5D-apphbR35e4xHc66ca2zbvf7_EHq_8hGYp4BUkQ6tBw_lTHN7xzolxHnTth33N2fcGXu6aHvPiEOuHMs82plA9rA4HIEMd1Ma19K7KZNv-ddX4SOlST3m17V2hjKQOIyOAmuuKslls4AL1_AjCxdIZBcgazYnc0ywl2NgU7wyd5b038WWZADpvV0oYAC7zdo0kJd7JfJ_VTi0r3EUVUYP8usGDYiFsJRBTxA3pEQcE7FnMHQoAuZAIpAM6xgbthJSPTL8"
        },
        {
            id: 6,
            title: "Micro Realism Portrait",
            category: "Forearm",
            clicks: 389,
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4IgJJhniGD9b90OTukKuRirxpAxX79QvQjffSIWD_jZPIX86E02aSbPGD_ls5qXSATQ7deLYUedd7cH-JCVDsKDZfggFhyRjkImbv8k-rAJxO1MfJf4rQ1-Nx1gB-QIZIYqTa_ubiv9qUeQV81S9PjINBqyg_qU6hzv0vqltH8OQYgMi_nbD2pRoutPfFlzRyKn2HU5xMp5TRLIQEZ0DkSLvNOlKsoQQSplpCxBJJxMqHt8EvDGcQDCwgPLQ_wF5dHNvTMOv9sGw"
        },
        {
            id: 7,
            title: "Watercolor Phoenix",
            category: "Thigh",
            clicks: 345,
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyMD9L5r44IqSP2MdCWm9iHsyNU7IAW6N-jekGY9rsxCGxjqLGOewtriFXc-Gd-JjcPHUriSI4Ppmof99WncWwjCcdtFezQ4f8aHlaGgQv1nlsc1yK8MwKbjHmE3diW_1C3RpE20F4Bc8qOoLY1MWrKM7fGSbw5urlenXW4a5sf8sV-Orpp77CsmmggBK0e4RyQgAfxzqLd_mPftGlqOL_xIY4QUlbext-64O-8i1FgRITMYFoLlZ7Qs4RFRX4ZTfeKYGpOJ5eeKI"
        },
        {
            id: 8,
            title: "Minimalist Lettering",
            category: "Wrist",
            clicks: 290,
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA50Ao1o2k-kqVgN-XE3SDK9U56jyalx5q1vc6cnyhR6NGM52e1lIcmqHvtNzQQxy5Wz0isfTypwgwsfgrM73jCwA2Ie2tajFcl1OETPUw3nsCZEiY2i01dycIIkzeg-vhfTACIMueyPf6XQboy7OZLKdQXrP8Pf0OGoWxBu4JQPxVttNp7EF6PvlyfKh6rcTzCwmVfqLlWK5x5sAY2p7LZB18LuyxOYLk6Acs0YXxnWAk9ZKbRaZNYhSbpZ0eQTmpNXgp45djg_y0"
        },
        {
            id: 9,
            title: "Tribal Band",
            category: "Bicep",
            clicks: 215,
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9uMge5D-apphbR35e4xHc66ca2zbvf7_EHq_8hGYp4BUkQ6tBw_lTHN7xzolxHnTth33N2fcGXu6aHvPiEOuHMs82plA9rA4HIEMd1Ma19K7KZNv-ddX4SOlST3m17V2hjKQOIyOAmuuKslls4AL1_AjCxdIZBcgazYnc0ywl2NgU7wyd5b038WWZADpvV0oYAC7zdo0kJd7JfJ_VTi0r3EUVUYP8usGDYiFsJRBTxA3pEQcE7FnMHQoAuZAIpAM6xgbthJSPTL8"
        },
        {
            id: 10,
            title: "Ornamental Sternum",
            category: "Chest",
            clicks: 180,
            imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4IgJJhniGD9b90OTukKuRirxpAxX79QvQjffSIWD_jZPIX86E02aSbPGD_ls5qXSATQ7deLYUedd7cH-JCVDsKDZfggFhyRjkImbv8k-rAJxO1MfJf4rQ1-Nx1gB-QIZIYqTa_ubiv9qUeQV81S9PjINBqyg_qU6hzv0vqltH8OQYgMi_nbD2pRoutPfFlzRyKn2HU5xMp5TRLIQEZ0DkSLvNOlKsoQQSplpCxBJJxMqHt8EvDGcQDCwgPLQ_wF5dHNvTMOv9sGw"
        }
    ];

`;

const searchRegex = /    const \[chartMetric, setChartMetric\] = useState\('views'\);/;
content = content.replace(searchRegex, modalState + searchRegex.source);

const searchRankingRegex = /                        <div className="flex flex-col">\n                            \{\/\* Ranking Item 1 \*\/\}[\s\S]*?<\/button>\n                    <\/div>/;

const replacementRanking = `                        <div className="flex flex-col">
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
                    </div>`;

content = content.replace(searchRankingRegex, replacementRanking);


const modalHTML = `
            {showRankingModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface-elevation border border-border-muted w-full max-w-md max-h-[85vh] flex flex-col relative" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
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
                        
                        <div className="flex-1 overflow-y-auto p-5 hide-scrollbar">
                            <div className="flex flex-col">
                                {topPhotos.map((photo, index) => (
                                    <React.Fragment key={photo.id}>
                                        <div className="flex items-center gap-4 hover:bg-surface-container-high transition-all py-3 px-2 rounded-sm cursor-pointer group">
                                            <div className={\`font-label-md text-lg w-6 text-center font-bold \${index < 3 ? 'text-primary-container' : 'text-on-surface-variant/50'}\`}>
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
`;

const replaceModalRegex = /(?=            <\/div>\n        <\/DemoLayout>)/;
content = content.replace(replaceModalRegex, modalHTML);

fs.writeFileSync('src/components/DemoMetrics.tsx', content);
