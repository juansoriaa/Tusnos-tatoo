const fs = require('fs');

let content = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

// The main content of waitlist starts with {/* Filters */} and ends before {/* Message Modal */}
const startMarker = '{/* Filters */}';
const endMarker = '{/* Message Modal */}';
const endMarker2 = '</div>    );';

let contentStart = content.indexOf(startMarker);
let contentEnd = content.indexOf(endMarker);

if (contentStart > -1 && contentEnd > -1) {
    let mainContent = content.substring(contentStart, contentEnd);
    let modals = content.substring(contentEnd, content.lastIndexOf(endMarker2));
    
    // Remove trailing </div> from mainContent if it's there? Waitlist has it inside a <main> or something?
    
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
                ${mainContent}
            </div>
            ${modals}
        </DemoLayout>
    );
}
`;
    fs.writeFileSync('src/components/DemoWaitlist.tsx', newFileContent);
}
