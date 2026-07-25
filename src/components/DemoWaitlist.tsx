import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoLayout from './DemoLayout';

export default function DemoWaitlist() {
    const navigate = useNavigate();
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [workModalData, setWorkModalData] = useState<any>(null);
    const [filterPeriod, setFilterPeriod] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [specificDate, setSpecificDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const defaultMessages = [
        { 
            id: 1,
            name: 'Alex M.', 
            time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
            title: 'Consulta de Cover-up', 
            text: 'Tengo un tatuaje antiguo en mi antebrazo que quiero cubrir con algo botánico. Específicamente buscando peonías y helechos en blackwork. ¿Es posible? Tengo imágenes de referencia.', 
            hasImage: true,
            referenceTitle: 'Referencia subida por el cliente',
            type: 'Nueva solicitud', 
            typeClass: 'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-border-muted whitespace-nowrap rounded',
            read: false,
            tags: ['Consulta', 'Refe. del usuario']
        },
        { 
            id: 2,
            name: 'Sarah L.', 
            time: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), 
            title: 'Confirmación de turno para el viernes', 
            text: 'Solo para confirmar nuestra cita para el viernes a las 2PM para la pieza tradicional. ¿Necesito hacer algo específico para prepararme?', 
            hasImage: false, 
            type: 'Programado', 
            typeClass: 'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-accent border border-emerald-accent/30 whitespace-nowrap rounded',
            read: true,
            tags: []
        }
    ];

    const formatMessageTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return isoString;

            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours < 24 && now.getDate() === date.getDate()) {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
                return date.toLocaleDateString();
            }
        } catch {
            return isoString;
        }
    };

    const [waitlistMessages, setWaitlistMessages] = useState<any[]>([]);
    
    React.useEffect(() => {
        const load = () => {
            try {
                const saved = localStorage.getItem('demoWaitlistMessages');
                if (saved) {
                    const parsed = JSON.parse(saved).map((msg: any) => ({
                        ...msg,
                        tags: msg.tags ? msg.tags.map((tag: string) => 
                            tag === 'Referencia subida por el usuario' ? 'Refe. del usuario' : 
                            tag === 'Referencia del portafolio' ? 'Refe. del portafolio' : tag
                        ) : msg.tags
                    }));
                    setWaitlistMessages(parsed);
                } else {
                    localStorage.setItem('demoWaitlistMessages', JSON.stringify(defaultMessages));
                    setWaitlistMessages(defaultMessages);
                }
            } catch(e) {}
        };
        load();
        window.addEventListener('newWaitlistMessage', load);
        return () => window.removeEventListener('newWaitlistMessage', load);
    }, []);

    const openMessageModal = (data: any) => {
        setSelectedMessage(data);
        if (data.read === false) {
            const updatedMessages = waitlistMessages.map(msg => 
                msg.id === data.id ? { ...msg, read: true } : msg
            );
            setWaitlistMessages(updatedMessages);
            localStorage.setItem('demoWaitlistMessages', JSON.stringify(updatedMessages));
            window.dispatchEvent(new CustomEvent('newWaitlistMessage'));
        }
    };

    const closeMessageModal = () => {
        setSelectedMessage(null);
    };

    const filteredMessages = waitlistMessages.filter(msg => {
        // Status filter
        if (filterStatus !== 'all') {
            if (filterStatus === 'consulta' && !msg.tags?.includes('Consulta')) return false;
            if (filterStatus === 'idea' && !msg.tags?.includes('Idea')) return false;
            if (filterStatus === 'refe_user' && !msg.tags?.includes('Refe. del usuario')) return false;
            if (filterStatus === 'refe_portfolio' && !msg.tags?.includes('Refe. del portafolio')) return false;
        }

        // Date filter
        if (filterPeriod !== 'all') {
            try {
                const msgDate = new Date(msg.time);
                const now = new Date();
                
                if (filterPeriod === 'today') {
                    if (msgDate.getDate() !== now.getDate() || msgDate.getMonth() !== now.getMonth() || msgDate.getFullYear() !== now.getFullYear()) return false;
                } else if (filterPeriod === 'week') {
                    const diffDays = (now.getTime() - msgDate.getTime()) / (1000 * 3600 * 24);
                    if (diffDays > 7) return false;
                } else if (filterPeriod === 'month') {
                    if (msgDate.getMonth() !== now.getMonth() || msgDate.getFullYear() !== now.getFullYear()) return false;
                } else if (filterPeriod === 'specific' && specificDate) {
                    const specific = new Date(specificDate + 'T00:00:00');
                    if (msgDate.getDate() !== specific.getDate() || msgDate.getMonth() !== specific.getMonth() || msgDate.getFullYear() !== specific.getFullYear()) return false;
                }
            } catch (e) {
                // Ignore invalid dates
            }
        }
        return true;
    });

    return (
        <DemoLayout 
            activeTab="schedule"
            titlePrefix="Gestión de"
            titleAccent="Turnos"
            description="Gestiona tus citas, mensajes y sesiones de tatuaje eficazmente."
        >
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="flex flex-col gap-1 w-full sm:w-auto relative">
                            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Periodo</label>
                            <select 
                                className="bg-deep-black border border-border-muted text-silver-text font-label-md text-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent cursor-pointer appearance-none w-full pr-10" 
                                style={{backgroundColor: '#050505', borderColor: '#353434'}}
                                value={filterPeriod}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFilterPeriod(val);
                                    if (val === 'specific') {
                                        setShowDatePicker(true);
                                    }
                                }}
                            >
                                <option value="all">Todo el historial</option>
                                <option value="today">Del día</option>
                                <option value="week">De semana</option>
                                <option value="month">Del mes</option>
                                <option value="specific">Fecha específica</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-10 pointer-events-none text-on-surface-variant">arrow_drop_down</span>
                        </div>
                        <div className="flex flex-col gap-1 w-full sm:w-auto relative">
                            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Estado</label>
                            <select 
                                className="bg-deep-black border border-border-muted text-silver-text font-label-md text-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent cursor-pointer appearance-none w-full pr-10" 
                                style={{backgroundColor: '#050505', borderColor: '#353434'}}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Todas las solicitudes</option>
                                <option value="consulta">Consulta</option>
                                <option value="idea">Idea</option>
                                <option value="refe_user">Refe. subida</option>
                                <option value="refe_portfolio">Refe. del portafolio</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-10 pointer-events-none text-on-surface-variant">arrow_drop_down</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {filteredMessages.map((msg, idx) => (
                        <article 
                            key={idx} 
                            className={`p-4 border-l-2 group cursor-pointer active:scale-95 transition-all duration-300 ${msg.read === false ? 'bg-[#054d44]/10 border-emerald-accent shadow-[0_0_15px_rgba(5,77,68,0.3)] animate-pulse-ring' : 'bg-surface-container-high border-outline-variant/30 hover:border-emerald-accent'}`} 
                            onClick={() => openMessageModal(msg)}
                            style={msg.read === false ? {borderLeftColor: '#95d2c6'} : {}}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-on-surface text-sm mr-1">{msg.name || '?'}</span>
                                    {msg.tags && msg.tags.length > 0 && msg.tags.map((tag: string, i: number) => (
                                        <span key={i} className="px-1.5 py-0.5 bg-[#03120f] text-emerald-accent border border-emerald-accent/50 text-[9px] font-bold uppercase tracking-wider rounded">
                                            {tag}
                                        </span>
                                    ))}
                                    {msg.read === false && (
                                        <span className="relative flex h-2.5 w-2.5 ml-1" title="Mensaje nuevo">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-accent opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-accent shadow-[0_0_8px_rgba(149,210,198,0.9)]"></span>
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs font-caption text-on-surface-variant whitespace-nowrap ml-2">{formatMessageTime(msg.time)}</span>
                            </div>
                            
                            {msg.title !== 'Consulta general' && msg.title !== 'Idea de tatuaje' && (
                                <h4 className="text-xs font-bold text-silver-text mb-1">{msg.title}</h4>
                            )}
                            <p className="text-xs font-caption text-on-surface-variant mb-4 line-clamp-2">{msg.text}</p>
                            
                            <div className="flex gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
                                {msg.hasImage && (
                                    <button className="flex-1 py-2 flex items-center justify-center hover:brightness-110 transition-all gap-2 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm" style={{backgroundColor: '#0b5047', border: '1px solid #0b5047'}} onClick={(e) => { e.stopPropagation(); setWorkModalData({ image: msg.referenceImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB9cjXc-As57VUHLLRBIMkJtdx3Mu3BvAB-nv6KxdzbgBimAv2sqkhAJHSDirz4qABVkR5VZHI4Yw7SYGnmPw9zw9Cxqqd385s0tZKAkdqeoHTuuif-cJ-vjyBGS_W_4mZT2v1uFrEsmZ5EgpgkA3wmO9gocTils0LCGmd10kapZocERnjdvoGl3pFvAgJ_-nyUHIhxIys8RggDiwSODk6IMwtiuzaZQQz4ut0AE4kWdygyqTVFdgjz3OIj3xnAGcsGvmtd9rot4gYe", title: msg.referenceTitle, tags: msg.tags }); }}>
                                        <span className="material-symbols-outlined text-sm">visibility</span> Ver obra
                                    </button>
                                )}
                                <button className="flex-1 py-2 flex items-center justify-center hover:brightness-110 transition-all gap-2 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm" style={{backgroundColor: '#0b5047', border: '1px solid #0b5047'}} onClick={(e) => { e.stopPropagation(); openMessageModal(msg); }}>
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path></svg> Responder
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Message Modal */}
            <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${selectedMessage ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'}`} onClick={closeMessageModal}>
                {selectedMessage && (
                    <div className="bg-surface-elevation border border-border-muted w-full max-w-lg flex flex-col scale-100 transition-transform duration-300 relative max-h-[90vh]"  onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 text-on-surface-variant hover:text-silver-text transition-colors z-10 p-2" onClick={closeMessageModal}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                            <div className="flex justify-between items-start mb-8 pr-8">
                                <div>
                                    <h3 className="font-headline-lg text-headline-md text-silver-text mb-2">{selectedMessage.name}</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant">{selectedMessage.time}</p>
                                </div>
                                <span className={selectedMessage.typeClass}>{selectedMessage.type}</span>
                            </div>
                            <div className="mb-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                                    {selectedMessage.title !== 'Consulta general' && selectedMessage.title !== 'Idea de tatuaje' && (
                                        <h4 className="font-headline-md text-headline-md text-primary m-0" dangerouslySetInnerHTML={{__html: selectedMessage.title}} style={{color: '#95d2c6'}}></h4>
                                    )}
                                    {selectedMessage.tags && selectedMessage.tags.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {selectedMessage.tags.map((tag: string, i: number) => (
                                                <span key={i} className="px-1.5 py-0.5 bg-[#03120f] text-emerald-accent border border-emerald-accent/50 text-[9px] uppercase tracking-wider rounded font-bold">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="bg-surface-container-lowest p-5 border border-border-muted overflow-hidden" style={{backgroundColor: '#0e0e0e', borderColor: '#353434'}}>
                                    <p className="font-body-lg text-body-md md:text-body-lg text-silver-text leading-relaxed whitespace-pre-wrap break-words">{selectedMessage.text}</p>
                                </div>
                                <div className="mt-8 flex flex-col gap-3">
                                    {selectedMessage.hasImage && (
                                        <button className="w-full text-white font-label-md text-label-md py-4 flex items-center justify-center gap-2 hover:brightness-110 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(11,80,71,0.4)] active:scale-95 transition-all duration-300" style={{backgroundColor: '#0b5047', border: '1px solid #0b5047'}} onClick={() => setWorkModalData({ image: selectedMessage.referenceImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB9cjXc-As57VUHLLRBIMkJtdx3Mu3BvAB-nv6KxdzbgBimAv2sqkhAJHSDirz4qABVkR5VZHI4Yw7SYGnmPw9zw9Cxqqd385s0tZKAkdqeoHTuuif-cJ-vjyBGS_W_4mZT2v1uFrEsmZ5EgpgkA3wmO9gocTils0LCGmd10kapZocERnjdvoGl3pFvAgJ_-nyUHIhxIys8RggDiwSODk6IMwtiuzaZQQz4ut0AE4kWdygyqTVFdgjz3OIj3xnAGcsGvmtd9rot4gYe", title: selectedMessage.referenceTitle, tags: selectedMessage.tags })}>
                                            <span className="material-symbols-outlined text-sm">visibility</span>Ver obra
                                        </button>
                                    )}
                                    <button className="w-full bg-[#0b5047] border border-[#0b5047] text-white font-label-md text-label-md py-4 flex items-center justify-center gap-2 hover:brightness-110 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(11,80,71,0.4)] active:scale-95 transition-all duration-300">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path></svg>Responder por WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Work Modal */}
            <div className={`fixed inset-0 bg-black/95 backdrop-blur-md z-[110] flex items-center justify-center p-4 transition-opacity duration-300 ${workModalData ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'}`} onClick={() => setWorkModalData(null)}>
                <div className="relative max-w-3xl w-full bg-surface-elevation border border-border-muted overflow-hidden scale-100 transition-transform duration-300 flex flex-col max-h-[90vh]"  onClick={(e) => e.stopPropagation()}>
                    <button className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 transition-colors z-20 p-2 rounded-full" onClick={() => setWorkModalData(null)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex-1 overflow-y-auto w-full flex items-center justify-center bg-black">
                        {workModalData && <img src={workModalData.image} className="w-full h-auto object-contain max-h-[70vh]" alt="Portfolio Reference" />}
                    </div>
                    <div className="p-6 border-t border-border-muted bg-surface-container shrink-0" style={{borderColor: '#353434'}}>
                        <div className="flex flex-col gap-2">
                            {workModalData?.tags?.includes('Refe. del portafolio') && workModalData?.title && workModalData?.title !== 'Imagen adjuntada' && (
                                <h3 className="font-headline-md text-silver-text mb-0">
                                    {workModalData.title}
                                </h3>
                            )}
                            <div className="flex flex-wrap gap-2 mt-1">
                                {workModalData?.tags?.includes('Consulta') && (
                                    <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-outline-variant/50 rounded">
                                        Consulta
                                    </span>
                                )}
                                {workModalData?.tags?.includes('Idea') && (
                                    <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-outline-variant/50 rounded">
                                        Idea
                                    </span>
                                )}
                                {workModalData?.tags?.includes('Refe. del portafolio') && (
                                    <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20 rounded">
                                        Referencia del portafolio
                                    </span>
                                )}
                                {workModalData?.tags?.includes('Refe. del usuario') && (
                                    <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-outline-variant/50 rounded">
                                        Referencia subida
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Date Picker Modal */}
            {showDatePicker && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[120] flex items-center justify-center p-4 transition-opacity duration-300" onClick={() => {setShowDatePicker(false); if (!specificDate) setFilterPeriod('all');}}>
                    <div className="bg-surface-elevation border border-border-muted w-full max-w-sm flex flex-col scale-100 transition-transform duration-300 p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-headline-md text-silver-text mb-4">Seleccionar Fecha</h3>
                        <input 
                            type="date" 
                            className="bg-deep-black border border-border-muted text-silver-text font-body-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full mb-6"
                            style={{backgroundColor: '#050505', borderColor: '#353434'}}
                            value={specificDate}
                            onChange={(e) => setSpecificDate(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <button 
                                className="flex-1 py-3 border border-border-muted text-on-surface-variant hover:text-silver-text hover:bg-surface-variant transition-colors uppercase tracking-widest font-bold text-[10px]"
                                onClick={() => {setShowDatePicker(false); if (!specificDate) setFilterPeriod('all');}}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="flex-1 py-3 bg-[#0b5047] text-white hover:brightness-110 transition-colors uppercase tracking-widest font-bold text-[10px]"
                                onClick={() => setShowDatePicker(false)}
                            >
                                Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DemoLayout>
    );
}
