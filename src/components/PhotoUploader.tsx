import React, { useState, useRef, useEffect } from 'react';

type UploadState = 'idle' | 'preview' | 'uploading' | 'success' | 'error';

export interface ImageFilters {
    contrast: { active: boolean; value: number };
    brightness: { active: boolean; value: number };
    blackIntensity: { active: boolean; value: number };
    activePreset: string | null;
}

interface PhotoUploaderProps {
    initialImageUrl?: string | null;
    initialFilters?: ImageFilters | null;
    isEditMode?: boolean;
    onCancelEdit?: () => void;
    onImageSelected?: (file: File | null) => void;
    onFiltersChanged?: (filters: ImageFilters) => void;
    resetTrigger?: number;
}

export default function PhotoUploader({ onImageSelected, onFiltersChanged, resetTrigger, initialImageUrl, initialFilters, isEditMode, onCancelEdit }: PhotoUploaderProps = {}) {
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filters state
    const [contrast, setContrast] = useState({ active: false, value: 50 });
    const [brightness, setBrightness] = useState({ active: false, value: 50 });
    const [blackIntensity, setBlackIntensity] = useState({ active: false, value: 50 });
    const [isEditingExpanded, setIsEditingExpanded] = useState(true);
    
    const [activePreset, setActivePreset] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (initialImageUrl) {
            setPreviewUrl(initialImageUrl);
            setUploadState('preview');
            // We don't call onImageSelected because there's no File. DemoPortfolio will know we are editing an existing photo.
        } else if (!previewUrl) {
            setUploadState('idle');
            setPreviewUrl(null);
        }
    }, [initialImageUrl]);

    useEffect(() => {
        if (initialFilters) {
            if (initialFilters.contrast) setContrast(initialFilters.contrast);
            if (initialFilters.brightness) setBrightness(initialFilters.brightness);
            if (initialFilters.blackIntensity) setBlackIntensity(initialFilters.blackIntensity);
            if (initialFilters.activePreset !== undefined) setActivePreset(initialFilters.activePreset);
        } else {
            setContrast({ active: false, value: 50 });
            setBrightness({ active: false, value: 50 });
            setBlackIntensity({ active: false, value: 50 });
            setActivePreset(null);
        }
    }, [initialFilters]);


    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setUploadState('error');
            setErrorMsg('Por favor selecciona una imagen válida.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setUploadState('error');
            setErrorMsg('La imagen supera el límite de 5MB.');
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setUploadState('preview');
        setErrorMsg(null);
        if (onImageSelected) onImageSelected(file);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const reset = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setUploadState('idle');
        setErrorMsg(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setContrast({ active: false, value: 50 });
        setBrightness({ active: false, value: 50 });
        setBlackIntensity({ active: false, value: 50 });
        setActivePreset(null);
        if (onImageSelected) onImageSelected(null);
    };

    useEffect(() => {
        if (resetTrigger) {
            reset();
        }
    }, [resetTrigger]);

    useEffect(() => {
        if (onFiltersChanged) {
            onFiltersChanged({ contrast, brightness, blackIntensity, activePreset });
        }
    }, [contrast, brightness, blackIntensity, activePreset, onFiltersChanged]);

    const handleImageClick = () => {
        const isAnyManualActive = contrast.active || brightness.active || blackIntensity.active;
        if (isAnyManualActive || activePreset) {
            setShowConfirmModal(true);
        } else {
            reset();
            setTimeout(() => {
                fileInputRef.current?.click();
            }, 100);
        }
    };

    const confirmChangePhoto = () => {
        setShowConfirmModal(false);
        reset();
        setTimeout(() => {
            fileInputRef.current?.click();
        }, 100);
    };

    const isAnyManualActive = contrast.active || brightness.active || blackIntensity.active;

    // Calculate CSS filter string
    const getFilterStyle = () => {
        let filterStr = '';
        if (activePreset && !isAnyManualActive) {
            if (activePreset === 'tinta_negra') filterStr = 'contrast(125%) brightness(95%) grayscale(15%)';
            if (activePreset === 'color') filterStr = 'contrast(110%) brightness(105%) saturate(130%)';
            if (activePreset === 'piel') filterStr = 'contrast(95%) brightness(105%) saturate(90%)';
            if (activePreset === 'blanco_y_negro') filterStr = 'grayscale(100%) contrast(130%)';
        } else {
            if (contrast.active) filterStr += `contrast(${contrast.value * 2}%) `;
            if (brightness.active) filterStr += `brightness(${brightness.value * 2}%) `;
            if (blackIntensity.active) filterStr += `grayscale(${blackIntensity.value}%) `;
        }
        return filterStr.trim();
    };

    const handlePresetToggle = (preset: string) => {
        if (activePreset === preset) {
            setActivePreset(null);
        } else {
            setActivePreset(preset);
        }
    };

    return (
        <div className="w-full relative space-y-4">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={onChange} 
                className="hidden" 
                accept="image/jpeg, image/png, image/webp" 
            />

            {(uploadState === 'idle' || uploadState === 'error') && (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    className="w-full h-48 border-2 border-dashed border-border-muted hover:border-emerald-accent rounded-lg transition-colors bg-deep-black flex flex-col items-center justify-center cursor-pointer group p-4 text-center" 
                    style={{backgroundColor: '#050505', borderColor: uploadState === 'error' ? '#ffb4ab' : '#353434'}}
                >
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-emerald-accent mb-2 transition-colors">
                        {uploadState === 'error' ? 'error' : 'add_photo_alternate'}
                    </span>
                    <span className="font-label-md text-on-surface-variant group-hover:text-silver-text transition-colors text-sm">
                        {uploadState === 'error' ? errorMsg : 'Arrastra la imagen o haz clic para buscar'}
                    </span>
                    <span className="font-caption text-on-surface-variant/70 mt-1">
                        JPG o PNG de alta resolución (Máx 5MB)
                    </span>
                </div>
            )}

            {uploadState === 'preview' && previewUrl && (
                <div className="space-y-4">
                    <div className="w-full h-48 border border-border-muted rounded-lg overflow-hidden relative group bg-deep-black" style={{borderColor: '#353434', backgroundColor: '#050505'}}>
                        <img 
                            src={previewUrl} 
                            alt="Vista previa" 
                            className="w-full h-full object-contain transition-all duration-300 group-hover:brightness-50" 
                            style={{ filter: getFilterStyle() }}
                        />
                        
                        {isEditMode && onCancelEdit && (
                            <button 
                                type="button" 
                                onClick={onCancelEdit}
                                className="absolute top-2 right-2 text-silver-text hover:text-white bg-deep-black/80 backdrop-blur-sm rounded-full p-1.5 border border-border-muted hover:border-emerald-accent transition-all z-20 shadow-md"
                                title="Cancelar edición"
                                style={{backgroundColor: 'rgba(5,5,5,0.8)', borderColor: '#353434'}}
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        )}
                        
                        <div className="absolute bottom-3 right-3 flex items-center justify-center pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button 
                                type="button"
                                onClick={handleImageClick}
                                className="pointer-events-auto bg-deep-black/80 backdrop-blur-sm border border-border-muted hover:border-emerald-accent text-silver-text hover:text-white transition-all duration-300 px-3 py-1.5 rounded-full flex items-center justify-center shadow-lg"
                                style={{backgroundColor: 'rgba(5,5,5,0.8)', borderColor: '#353434'}}
                            >
                                <span className="material-symbols-outlined text-[16px] mr-1.5">swap_horiz</span>
                                <span className="font-label-md text-[10px] uppercase tracking-wider">Cambiar Foto</span>
                            </button>
                        </div>
                    </div>

                    {uploadState === 'preview' && (
                        <div className="border border-border-muted p-4 bg-deep-black/50 rounded-lg overflow-hidden transition-all duration-300" style={{borderColor: '#353434', backgroundColor: 'rgba(5,5,5,0.5)'}}>
                            <div 
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => setIsEditingExpanded(!isEditingExpanded)}
                            >
                                <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider flex items-center text-xs group-hover:text-emerald-accent transition-colors mb-0">
                                    <span className="material-symbols-outlined mr-2 text-[16px]">tune</span>
                                    Minimal Editing
                                </h3>
                                <button type="button" className="text-on-surface-variant group-hover:text-emerald-accent transition-colors flex items-center">
                                    <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${isEditingExpanded ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </button>
                            </div>
                            
                            <div className={`transition-all duration-300 ease-in-out ${isEditingExpanded ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Left Column: Manual Adjustments */}
                                    <div className={`space-y-4 transition-all duration-300 ${isAnyManualActive ? 'col-span-1 lg:col-span-2' : ''}`}>
                                        {/* Contraste */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    id="contrast-check"
                                                    className="w-4 h-4 rounded border-border-muted bg-surface-variant text-emerald-accent focus:ring-emerald-accent focus:ring-offset-deep-black cursor-pointer"
                                                    checked={contrast.active}
                                                    onChange={(e) => setContrast(prev => ({...prev, active: e.target.checked}))}
                                                />
                                                <label htmlFor="contrast-check" className="flex items-center gap-2 font-label-sm text-silver-text text-xs cursor-pointer select-none" style={{color: '#e5e2e1'}}>
                                                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">contrast</span>
                                                    Contraste
                                                </label>
                                                <span className={`font-label-sm text-on-surface-variant text-xs ml-auto transition-opacity duration-300 ${contrast.active ? 'opacity-100' : 'opacity-0'}`}>{contrast.value}</span>
                                            </div>
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${contrast.active ? 'max-h-12 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <input 
                                                    max="100" 
                                                    min="0" 
                                                    type="range" 
                                                    className="w-full"
                                                    value={contrast.value}
                                                    onChange={(e) => setContrast(prev => ({...prev, value: parseInt(e.target.value)}))}
                                                />
                                            </div>
                                        </div>

                                        {/* Brillo */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    id="brightness-check"
                                                    className="w-4 h-4 rounded border-border-muted bg-surface-variant text-emerald-accent focus:ring-emerald-accent focus:ring-offset-deep-black cursor-pointer"
                                                    checked={brightness.active}
                                                    onChange={(e) => setBrightness(prev => ({...prev, active: e.target.checked}))}
                                                />
                                                <label htmlFor="brightness-check" className="flex items-center gap-2 font-label-sm text-silver-text text-xs cursor-pointer select-none" style={{color: '#e5e2e1'}}>
                                                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">light_mode</span>
                                                    Brillo
                                                </label>
                                                <span className={`font-label-sm text-on-surface-variant text-xs ml-auto transition-opacity duration-300 ${brightness.active ? 'opacity-100' : 'opacity-0'}`}>{brightness.value}</span>
                                            </div>
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${brightness.active ? 'max-h-12 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <input 
                                                    max="100" 
                                                    min="0" 
                                                    type="range" 
                                                    className="w-full"
                                                    value={brightness.value}
                                                    onChange={(e) => setBrightness(prev => ({...prev, value: parseInt(e.target.value)}))}
                                                />
                                            </div>
                                        </div>

                                        {/* Intensidad de Negro */}
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    id="black-intensity-check"
                                                    className="w-4 h-4 rounded border-border-muted bg-surface-variant text-emerald-accent focus:ring-emerald-accent focus:ring-offset-deep-black cursor-pointer"
                                                    checked={blackIntensity.active}
                                                    onChange={(e) => setBlackIntensity(prev => ({...prev, active: e.target.checked}))}
                                                />
                                                <label htmlFor="black-intensity-check" className="flex items-center gap-2 font-label-sm text-silver-text text-xs cursor-pointer select-none" style={{color: '#e5e2e1'}}>
                                                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">tonality</span>
                                                    Tonos Oscuros
                                                </label>
                                                <span className={`font-label-sm text-on-surface-variant text-xs ml-auto transition-opacity duration-300 ${blackIntensity.active ? 'opacity-100' : 'opacity-0'}`}>{blackIntensity.value}</span>
                                            </div>
                                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${blackIntensity.active ? 'max-h-12 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <input 
                                                    max="100" 
                                                    min="0" 
                                                    type="range" 
                                                    className="w-full"
                                                    value={blackIntensity.value}
                                                    onChange={(e) => setBlackIntensity(prev => ({...prev, value: parseInt(e.target.value)}))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Automatic Presets */}
                                    <div className={`transition-all duration-300 overflow-hidden ${isAnyManualActive ? 'opacity-0 max-h-0' : 'opacity-100 max-h-[500px]'}`}>
                                        <div className="space-y-4 pl-0 lg:pl-6 lg:border-l border-border-muted" style={{borderColor: '#353434'}}>
                                            <h4 className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px] mb-3">Ajustes Automáticos</h4>
                                            
                                            <div className="flex items-start gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    id="preset-tinta"
                                                    className="w-4 h-4 mt-0.5 rounded border-border-muted bg-surface-variant text-emerald-accent focus:ring-emerald-accent focus:ring-offset-deep-black cursor-pointer"
                                                    checked={activePreset === 'tinta_negra'}
                                                    onChange={() => handlePresetToggle('tinta_negra')}
                                                />
                                                <div>
                                                    <label htmlFor="preset-tinta" className="font-label-sm text-silver-text text-xs cursor-pointer block select-none" style={{color: '#e5e2e1'}}>Resaltar Tinta Negra</label>
                                                    <p className="font-caption text-on-surface-variant/70 text-[10px] mt-0.5">Ideal para blackwork. Aumenta el contraste y oscurece sombras.</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    id="preset-color"
                                                    className="w-4 h-4 mt-0.5 rounded border-border-muted bg-surface-variant text-emerald-accent focus:ring-emerald-accent focus:ring-offset-deep-black cursor-pointer"
                                                    checked={activePreset === 'color'}
                                                    onChange={() => handlePresetToggle('color')}
                                                />
                                                <div>
                                                    <label htmlFor="preset-color" className="font-label-sm text-silver-text text-xs cursor-pointer block select-none" style={{color: '#e5e2e1'}}>Resaltar Color / Ambiente</label>
                                                    <p className="font-caption text-on-surface-variant/70 text-[10px] mt-0.5">Realza tonos vibrantes aumentando la saturación y brillo.</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    id="preset-piel"
                                                    className="w-4 h-4 mt-0.5 rounded border-border-muted bg-surface-variant text-emerald-accent focus:ring-emerald-accent focus:ring-offset-deep-black cursor-pointer"
                                                    checked={activePreset === 'piel'}
                                                    onChange={() => handlePresetToggle('piel')}
                                                />
                                                <div>
                                                    <label htmlFor="preset-piel" className="font-label-sm text-silver-text text-xs cursor-pointer block select-none" style={{color: '#e5e2e1'}}>Ajuste de Piel</label>
                                                    <p className="font-caption text-on-surface-variant/70 text-[10px] mt-0.5">Suaviza el contraste para un acabado más natural y uniforme.</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    id="preset-bn"
                                                    className="w-4 h-4 mt-0.5 rounded border-border-muted bg-surface-variant text-emerald-accent focus:ring-emerald-accent focus:ring-offset-deep-black cursor-pointer"
                                                    checked={activePreset === 'blanco_y_negro'}
                                                    onChange={() => handlePresetToggle('blanco_y_negro')}
                                                />
                                                <div>
                                                    <label htmlFor="preset-bn" className="font-label-sm text-silver-text text-xs cursor-pointer block select-none" style={{color: '#e5e2e1'}}>Blanco y Negro</label>
                                                    <p className="font-caption text-on-surface-variant/70 text-[10px] mt-0.5">Elimina los colores y resalta el negro del tatuaje.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal de Confirmación */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                    <div className="bg-surface-elevation border border-border-muted rounded-lg max-w-sm w-full p-6 shadow-2xl" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        <h3 className="font-headline-md text-silver-text text-lg mb-2" style={{color: '#e5e2e1'}}>¿Cambiar foto?</h3>
                        <p className="font-body-md text-on-surface-variant text-sm mb-6">
                            Vas a perder los cambios de edición realizados. ¿Deseas continuar y seleccionar otra foto?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button 
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 rounded font-label-md text-sm text-silver-text hover:bg-surface-variant transition-colors border border-transparent"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button"
                                onClick={confirmChangePhoto}
                                className="px-4 py-2 rounded font-label-md text-sm text-black bg-emerald-accent hover:brightness-110 transition-colors"
                                style={{backgroundColor: '#054d44', color: '#e5e2e1'}}
                            >
                                Sí, cambiar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
