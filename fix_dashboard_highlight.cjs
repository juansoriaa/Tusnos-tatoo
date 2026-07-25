const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// First, find if we need state for animation
const reactImport = `import React, { useState, useEffect } from 'react';`;
const useNavigate = `    const navigate = useNavigate();
    const [isAvailable, setIsAvailable] = useState(true);
    const [modalOpen, setModalOpen] = useState<string | null>(null);`;
    
if (!content.includes('const [animateHighlight, setAnimateHighlight] = useState(false);')) {
    content = content.replace(useNavigate, `    const navigate = useNavigate();
    const [isAvailable, setIsAvailable] = useState(true);
    const [modalOpen, setModalOpen] = useState<string | null>(null);
    const [animateHighlight, setAnimateHighlight] = useState(false);`);
}

const onChangeTarget = `onChange={(e) => {
    const newIsAvailable = !e.target.checked;
    setIsAvailable(newIsAvailable);
    
    // Save to localStorage immediately so DemoLayout state is preserved across route changes`;

const onChangeReplacement = `onChange={(e) => {
    const newIsAvailable = !e.target.checked;
    setIsAvailable(newIsAvailable);
    if (!newIsAvailable) {
        setAnimateHighlight(true);
        setTimeout(() => setAnimateHighlight(false), 2000);
    }
    
    // Save to localStorage immediately so DemoLayout state is preserved across route changes`;

if (!content.includes('setAnimateHighlight(true)')) {
    content = content.replace(onChangeTarget, onChangeReplacement);
}

const oldCard = `className={\`w-full bg-surface-container-low p-6 border-2 flex items-center justify-between gap-4 transition-all duration-300 \${!isAvailable ? 'border-error shadow-[0_0_30px_rgba(255,180,171,0.4)] animate-pulse-ring' : 'border-primary shadow-[0_0_30px_rgba(5,77,68,0.4)]'}\`}`;
const newCard = `className={\`w-full bg-surface-container-low p-6 border-2 flex items-center justify-between gap-4 transition-all duration-300 \${animateHighlight ? 'scale-[1.02] shadow-[0_0_30px_rgba(255,180,171,0.6)] border-error' : (!isAvailable ? 'border-error shadow-[0_0_15px_rgba(255,180,171,0.2)]' : 'border-primary shadow-[0_0_15px_rgba(5,77,68,0.2)]')}\`}`;
content = content.replace(oldCard, newCard);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
