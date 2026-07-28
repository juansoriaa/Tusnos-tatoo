const fs = require('fs');
let code = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

code = code.replace(
    /const updatedMessages = waitlistMessages\.map\(msg => [\s\S]*?msg\.id === data\.id \? \{ \.\.\.msg, read: true \} : msg[\s\S]*?\);[\s\S]*?setWaitlistMessages\(updatedMessages\);[\s\S]*?const targetId = id \|\| localStorage\.getItem\('demoUserId'\) \|\| auth\.currentUser\?\.uid \|\| 'demo';[\s\S]*?localStorage\.setItem\('demoWaitlistMessages_' \+ targetId, JSON\.stringify\(updatedMessages\)\);/,
    `const targetId = id || localStorage.getItem('demoUserId') || auth.currentUser?.uid || 'demo';
            if (targetId && targetId !== 'demo') {
                import('firebase/firestore').then(({ doc, updateDoc }) => {
                    updateDoc(doc(db, 'users', targetId, 'waitlist', data.id), { read: true }).catch(console.error);
                });
            } else {
                const updatedMessages = waitlistMessages.map(msg => 
                    msg.id === data.id ? { ...msg, read: true } : msg
                );
                setWaitlistMessages(updatedMessages);
                localStorage.setItem('demoWaitlistMessages_' + targetId, JSON.stringify(updatedMessages));
            }`
);

fs.writeFileSync('src/components/DemoWaitlist.tsx', code);
