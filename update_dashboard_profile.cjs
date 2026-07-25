const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// 1. Add Default constants
const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuByR4NUyVVJG5GuLGaRtqWjpCad-ssRG7wJNZiOOJeHykIY9S2eAKXt_nFpI-7F2iK5qdsDhGuFSANZwR96NefHXWFWgkMa2FidlBxVLFU0DO3Khup5Pf9Q_MG-vp8HknfP7FmcKogpQ_BM5vOFw6n1k1mUehIFrxuYqUYBYIOy7jV2RuELrtSHo6ByyE3njg-7BtFcOAWsX8GRbNlrtZ82vz663Cvn1wbr_619qMHrZiTBEOFbX9yhCv1oiB67MwD68MZWnGOjnHo';
const defaultBanner = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjcpGXPEz0beDBlZrbWo96kxL8SYcB5zMiiXz1xbrFmwvqYW5GPQex6oox-awu_xzVDV-xVHBOZb7J5FaWinZxyv-p_dVvx7nyqWDm8DE96ZCcZjiGx9i8SoPVlU1tgx7piOQQuHe-KPGo797xTz3-Hah3jLnvIr5MmnaWY0vzOsFmANOtV305mcB8ioZWPXCwwEkhO3pFM2gsdfbO2cw8vwlVJxKBOTpjtD1hKf22NaaGM7lT4hpZ-5-bVKccq_JRci5J0v0uXR0';

// 2. Add states
const statesToAdd = `
    const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
    const [bannerUrl, setBannerUrl] = useState(defaultBanner);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: React.Dispatch<React.SetStateAction<string>>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo excede el tamaño máximo de 5MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
`;

if (!content.includes('const handleFileUpload')) {
    content = content.replace(/(const \[facebook, setFacebook\] = useState\(''\);)/, '$1' + statesToAdd);
}

// 3. Update useEffect
const loadEffect = `setFacebook(data.facebook || '');`;
const loadEffectNew = `setFacebook(data.facebook || '');
                setAvatarUrl(data.profilePhotoUrl || defaultAvatar);
                setBannerUrl(data.backgroundPhotos?.[0] || defaultBanner);`;
content = content.replace(loadEffect, loadEffectNew);

// 4. Update save button
const saveDataTarget = `mapLink: mapLink
                                    };`;
const saveDataReplacement = `mapLink: mapLink,
                                        profilePhotoUrl: avatarUrl,
                                        backgroundPhotos: [bannerUrl]
                                    };`;
content = content.replace(saveDataTarget, saveDataReplacement);

// 5. Replace Banner JSX
const oldBanner = `<div className="group relative h-32 bg-surface-container-lowest border border-dashed border-outline-variant/40 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-primary">
                                    <div className="absolute inset-0 opacity-20 grayscale">
                                        <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjcpGXPEz0beDBlZrbWo96kxL8SYcB5zMiiXz1xbrFmwvqYW5GPQex6oox-awu_xzVDV-xVHBOZb7J5FaWinZxyv-p_dVvx7nyqWDm8DE96ZCcZjiGx9i8SoPVlU1tgx7piOQQuHe-KPGo797xTz3-Hah3jLnvIr5MmnaWY0vzOsFmANOtV305mcB8ioZWPXCwwEkhO3pFM2gsdfbO2cw8vwlVJxKBOTpjtD1hKf22NaaGM7lT4hpZ-5-bVKccq_JRci5J0v0uXR0')"}}></div>
                                    </div>
                                    <div className="relative z-10 flex flex-col items-center gap-2">
                                        <span className="material-symbols-outlined text-2xl" data-icon="add_a_photo">add_a_photo</span>
                                        <p className="font-label-md text-xs uppercase">Change Banner</p>
                                    </div>
                                </div>`;
const newBanner = `<label className="group relative h-32 bg-surface-container-lowest border border-dashed border-outline-variant/40 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-primary block">
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setBannerUrl)} />
                                    <div className="absolute inset-0 opacity-20 grayscale">
                                        <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: \`url('\${bannerUrl}')\`}}></div>
                                    </div>
                                    <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                                        <span className="material-symbols-outlined text-2xl" data-icon="add_a_photo">add_a_photo</span>
                                        <p className="font-label-md text-xs uppercase">Cambiar Banner</p>
                                        <p className="font-caption text-[10px] text-on-surface-variant px-4">Recomendado: 1200x400px. Máx: 5MB.<br/>(Se aplica filtro oscuro)</p>
                                    </div>
                                </label>`;
content = content.replace(oldBanner, newBanner);

// 6. Replace Avatar JSX
const oldAvatar = `<div className="shrink-0 mx-auto">
                                        <div className="w-24 h-24 bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByR4NUyVVJG5GuLGaRtqWjpCad-ssRG7wJNZiOOJeHykIY9S2eAKXt_nFpI-7F2iK5qdsDhGuFSANZwR96NefHXWFWgkMa2FidlBxVLFU0DO3Khup5Pf9Q_MG-vp8HknfP7FmcKogpQ_BM5vOFw6n1k1mUehIFrxuYqUYBYIOy7jV2RuELrtSHo6ByyE3njg-7BtFcOAWsX8GRbNlrtZ82vz663Cvn1wbr_619qMHrZiTBEOFbX9yhCv1oiB67MwD68MZWnGOjnHo" />
                                            <div className="absolute inset-0 bg-surface/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined" data-icon="upload">upload</span>
                                            </div>
                                        </div>
                                        <p className="text-caption font-caption text-center mt-2 uppercase text-on-surface-variant">Avatar</p>
                                    </div>`;

const newAvatar = `<div className="shrink-0 mx-auto flex flex-col items-center text-center">
                                        <label className="w-24 h-24 bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center relative group cursor-pointer overflow-hidden block">
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setAvatarUrl)} />
                                            <img className="w-full h-full object-cover" src={avatarUrl} />
                                            <div className="absolute inset-0 bg-surface/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined" data-icon="upload">upload</span>
                                            </div>
                                        </label>
                                        <p className="text-caption font-caption text-center mt-2 uppercase text-on-surface-variant">Avatar</p>
                                        <p className="font-caption text-[10px] text-on-surface-variant mt-1">Recomendado: 400x400px.<br/>Máx: 5MB.</p>
                                    </div>`;

content = content.replace(oldAvatar, newAvatar);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);

