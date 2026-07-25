const fs = require('fs');
let content = fs.readFileSync('src/components/PhotoUploader.tsx', 'utf8');

content = content.replace(
  'interface PhotoUploaderProps {',
  `interface PhotoUploaderProps {
    initialImageUrl?: string | null;
    initialFilters?: ImageFilters | null;
    isEditMode?: boolean;
    onCancelEdit?: () => void;`
);

content = content.replace(
  'export default function PhotoUploader({ onImageSelected, onFiltersChanged, resetTrigger }: PhotoUploaderProps = {}) {',
  'export default function PhotoUploader({ onImageSelected, onFiltersChanged, resetTrigger, initialImageUrl, initialFilters, isEditMode, onCancelEdit }: PhotoUploaderProps = {}) {'
);

const effectString = `
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
`;

content = content.replace(
  'const [showConfirmModal, setShowConfirmModal] = useState(false);',
  'const [showConfirmModal, setShowConfirmModal] = useState(false);\n' + effectString
);

// Add the X cancel button when in preview mode and edit mode
content = content.replace(
  '<div className="w-full h-48 border border-border-muted rounded-lg overflow-hidden relative group bg-deep-black"',
  `{isEditMode && onCancelEdit && (
                        <div className="flex justify-end mb-2">
                            <button 
                                type="button" 
                                onClick={onCancelEdit}
                                className="text-on-surface-variant hover:text-white bg-surface-variant rounded-full p-1 border border-border-muted hover:border-emerald-accent transition-colors"
                                title="Cancelar edición"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                    )}
                    <div className="w-full h-48 border border-border-muted rounded-lg overflow-hidden relative group bg-deep-black"`
);

fs.writeFileSync('src/components/PhotoUploader.tsx', content);
