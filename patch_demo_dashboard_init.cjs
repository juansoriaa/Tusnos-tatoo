const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf-8');

const oldBlock = `                setName(data.displayName || 'Victor Ink');
                setBio(data.bio || 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.');
                setSpecialty1((data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[0] || '') : 'Realismo');
                setSpecialty2((data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[1] || '') : 'Black & Grey');
                setSpecialty3(data.specialtyTags?.[2] || '');
                setIsAvailable(data.isAvailable !== false);
                setWhatsapp(data.whatsapp || '');
                setLoginEmail(data.email || '');
                setCustomPassword(data.customPassword || '');
                setInstagram(data.instagram || '');
                setFacebook(data.facebook || '');
                setTiktok(data.tiktok || '');
                setAvatarUrl(data.profilePhotoUrl || defaultAvatar);
                setBannerUrl(data.backgroundPhotos?.[0] || defaultBanner);
                setMapLink(data.mapLink || '');
                setHasPhysicalStudio(data.hasPhysicalStudio !== false);
                setStudioName(data.studioName || '');
                setStudioDescription(data.studioDescription || '');
                setStudioAddress(data.studioAddress || '');
                if (data.faqs) setFaqs(data.faqs);
                setStudioHours(data.studioHours || '');
                
                setInitialDataStr(JSON.stringify({
                    name: data.displayName || 'Victor Ink',
                    bio: data.bio || 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.',
                    specialty1: (data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[0] || '') : 'Realismo',
                    specialty2: (data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[1] || '') : 'Black & Grey',
                    specialty3: data.specialtyTags?.[2] || '',
                    isAvailable: data.isAvailable !== false,
                    whatsapp: data.whatsapp || '',
                    loginEmail: data.email || '',
                    customPassword: data.customPassword || '',
                    instagram: data.instagram || '',
                    facebook: data.facebook || '',
                    tiktok: data.tiktok || '',
                    avatarUrl: data.profilePhotoUrl || defaultAvatar,
                    bannerUrl: (data.backgroundPhotos && data.backgroundPhotos.length > 0) ? data.backgroundPhotos[0] : defaultBanner,
                    hasPhysicalStudio: data.hasPhysicalStudio !== false,
                    studioName: data.studioName || '',
                    studioDescription: data.studioDescription || '',
                    studioAddress: data.studioAddress || '',
                    studioHours: data.studioHours || '',
                    mapLink: data.mapLink || '',
                    faqs: data.faqs || defaultFaqs
                }));`;

const newBlock = `                const initData = {
                    name: data.displayName || 'Victor Ink',
                    bio: data.bio || 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.',
                    specialty1: (data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[0] || '') : 'Realismo',
                    specialty2: (data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[1] || '') : 'Black & Grey',
                    specialty3: data.specialtyTags?.[2] || '',
                    isAvailable: data.isAvailable !== false,
                    whatsapp: data.whatsapp || '',
                    loginEmail: data.email || '',
                    customPassword: data.customPassword || '',
                    instagram: data.instagram || '',
                    facebook: data.facebook || '',
                    tiktok: data.tiktok || '',
                    avatarUrl: data.profilePhotoUrl || defaultAvatar,
                    bannerUrl: (data.backgroundPhotos && data.backgroundPhotos.length > 0) ? data.backgroundPhotos[0] : defaultBanner,
                    hasPhysicalStudio: data.hasPhysicalStudio !== false,
                    studioName: data.studioName || '',
                    studioDescription: data.studioDescription || '',
                    studioAddress: data.studioAddress || '',
                    studioHours: data.studioHours || '',
                    mapLink: data.mapLink || '',
                    faqs: data.faqs || defaultFaqs
                };
                setName(initData.name);
                setBio(initData.bio);
                setSpecialty1(initData.specialty1);
                setSpecialty2(initData.specialty2);
                setSpecialty3(initData.specialty3);
                setIsAvailable(initData.isAvailable);
                setWhatsapp(initData.whatsapp);
                setLoginEmail(initData.loginEmail);
                setCustomPassword(initData.customPassword);
                setInstagram(initData.instagram);
                setFacebook(initData.facebook);
                setTiktok(initData.tiktok);
                setAvatarUrl(initData.avatarUrl);
                setBannerUrl(initData.bannerUrl);
                setHasPhysicalStudio(initData.hasPhysicalStudio);
                setStudioName(initData.studioName);
                setStudioDescription(initData.studioDescription);
                setStudioAddress(initData.studioAddress);
                setStudioHours(initData.studioHours);
                setMapLink(initData.mapLink);
                setFaqs(initData.faqs);
                
                setInitialDataStr(JSON.stringify(initData));`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
console.log("Patched DemoDashboard sync successfully!");
