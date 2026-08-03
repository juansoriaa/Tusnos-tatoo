const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf-8');

const oldElseBlock = `            setInitialDataStr(JSON.stringify({
                name: 'Victor Ink',
                bio: 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.',
                specialty1: 'Realismo',
                specialty2: 'Black & Grey',
                specialty3: '',
                isAvailable: true,
                whatsapp: '',
                loginEmail: '',
                customPassword: '',
                instagram: '',
                facebook: '',
                tiktok: '',
                avatarUrl: defaultAvatar,
                bannerUrl: defaultBanner,
                hasPhysicalStudio: true,
                studioName: '',
                studioDescription: '',
                studioAddress: '',
                studioHours: '',
                mapLink: '',
                faqs: defaultFaqs
            }));`;

const newElseBlock = `            const initData = {
                name: 'Victor Ink',
                bio: 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.',
                specialty1: 'Realismo',
                specialty2: 'Black & Grey',
                specialty3: '',
                isAvailable: true,
                whatsapp: '',
                loginEmail: '',
                customPassword: '',
                instagram: '',
                facebook: '',
                tiktok: '',
                avatarUrl: defaultAvatar,
                bannerUrl: defaultBanner,
                hasPhysicalStudio: true,
                studioName: '',
                studioDescription: '',
                studioAddress: '',
                studioHours: '',
                mapLink: '',
                faqs: defaultFaqs
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

content = content.replace(oldElseBlock, newElseBlock);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
console.log("Patched DemoDashboard else block successfully!");
