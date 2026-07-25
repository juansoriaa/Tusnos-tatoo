const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const oldHasChanges = `
        if (JSON.stringify(imageFilters) !== JSON.stringify(initialFormState.filters)) return true;
        if (selectedFile) return true;
        
        return false;
    };`;

const newHasChanges = `
        const isFiltersActive = (f: any) => f && (f.activePreset || f.contrast?.active || f.brightness?.active || f.blackIntensity?.active);
        const currentActive = isFiltersActive(imageFilters);
        const initialActive = isFiltersActive(initialFormState.filters);
        
        if (currentActive !== initialActive) return true;
        if (currentActive && JSON.stringify(imageFilters) !== JSON.stringify(initialFormState.filters)) return true;
        
        if (selectedFile) return true;
        
        return false;
    };`;

content = content.replace(oldHasChanges, newHasChanges);
fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
