const fs = require('fs');
const content = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

const canvasMarker = '{/* Canvas */}';
const canvasStart = content.indexOf(canvasMarker);

if (canvasStart > -1) {
    let mainContent = content.substring(canvasStart);
    
    // We need to remove the BottomNavBar and the closing tags from mainContent
    const bottomNavMarker = '{/* BottomNavBar Mobile */}';
    const bottomNavStart = mainContent.indexOf(bottomNavMarker);
    
    let canvasAndModals = mainContent;
    if (bottomNavStart > -1) {
        // we extract the content before BottomNavBar Mobile, and the Modals after it
        let beforeNav = mainContent.substring(0, bottomNavStart);
        let afterNav = mainContent.substring(bottomNavStart);
        
        const messageModalMarker = '{/* Message Modal */}';
        const messageModalStart = afterNav.indexOf(messageModalMarker);
        
        if (messageModalStart > -1) {
            let modalsContent = afterNav.substring(messageModalStart);
            
            // Clean up the end of modalsContent
            modalsContent = modalsContent.replace(/<\/main>|<\/div>|\);\s*}/g, '').trim();
            
            // Wait, beforeNav needs its closing div/main removed as well if there are any trailing ones.
            beforeNav = beforeNav.replace(/<\/main>$/g, '').trim();
            
            let newFileContent = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoLayout from './DemoLayout';

export default function DemoWaitlist() {
    const navigate = useNavigate();
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [workModalOpen, setWorkModalOpen] = useState(false);

    const openMessageModal = (data: any) => {
        setSelectedMessage(data);
    };

    const closeMessageModal = () => {
        setSelectedMessage(null);
    };

    return (
        <DemoLayout 
            activeTab="schedule"
            titlePrefix="Gestión de"
            titleAccent="Turnos"
            description="Manage your appointments, messages, and tattoo sessions effectively."
        >
            <div className="flex flex-col gap-6">
                ${beforeNav}
            </div>
            ${modalsContent}
        </DemoLayout>
    );
}
`;
            fs.writeFileSync('src/components/DemoWaitlist.tsx', newFileContent);
        }
    }
}
