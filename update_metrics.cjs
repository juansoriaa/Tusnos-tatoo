const fs = require('fs');
let content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

const startMarker = '{/* KPI Summary Bento Grid */}';
const endMarker = '</main>';

let contentStart = content.indexOf(startMarker);
let contentEnd = content.indexOf(endMarker);

if (contentStart > -1 && contentEnd > -1) {
    let mainContent = content.substring(contentStart, contentEnd);
    
    let newFileContent = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import DemoLayout from './DemoLayout';

export default function DemoMetrics() {
    const navigate = useNavigate();

    return (
        <DemoLayout 
            activeTab="metrics"
            titlePrefix="Gestión de"
            titleAccent="Métricas"
            description="Track your performance, view interactions, and analyze your engagement over time."
        >
            <div className="flex flex-col gap-6">
                ${mainContent}
            </div>
        </DemoLayout>
    );
}
`;
    fs.writeFileSync('src/components/DemoMetrics.tsx', newFileContent);
}
