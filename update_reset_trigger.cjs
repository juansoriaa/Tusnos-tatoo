const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// Add resetUploader state
const statesSearch = "const [initialFormState, setInitialFormState] = useState<any>(null);";
content = content.replace(statesSearch, statesSearch + "\n    const [resetUploader, setResetUploader] = useState(0);");

// Increment resetUploader in cancelEdit
const cancelEditSearch = "setSelectedFile(null);\n    };";
content = content.replace(cancelEditSearch, "setSelectedFile(null);\n        setResetUploader(prev => prev + 1);\n    };");

// Also increment in startEditing just to be safe
const startEditSearch = "window.scrollTo({ top: 0, behavior: 'smooth' });\n    };";
content = content.replace(startEditSearch, "setResetUploader(prev => prev + 1);\n        " + startEditSearch);

// Pass it to PhotoUploader
const photoUploaderSearch = "onCancelEdit={handleCancelEdit}\n            />";
content = content.replace(photoUploaderSearch, "onCancelEdit={handleCancelEdit}\n                resetTrigger={resetUploader}\n            />");

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
