const fs = require('fs');

function applyLimits() {
    // 1. DemoWaitlist.tsx
    let wait = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');
    if (!wait.includes("limit(")) {
        wait = wait.replace("import { doc, updateDoc, deleteDoc, collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';", "import { doc, updateDoc, deleteDoc, collection, query, onSnapshot, addDoc, serverTimestamp, limit, orderBy } from 'firebase/firestore';");
        wait = wait.replace("const q = query(collection(db, 'users', targetUserId, 'waitlist'));", "const q = query(collection(db, 'users', targetUserId, 'waitlist'), orderBy('createdAt', 'desc'), limit(50));");
        fs.writeFileSync('src/components/DemoWaitlist.tsx', wait);
        console.log("DemoWaitlist limited.");
    }

    // 2. DemoLayout.tsx
    let layout = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');
    if (!layout.includes("limit(")) {
        layout = layout.replace("import { doc, onSnapshot, collection, query, orderBy, where, updateDoc } from 'firebase/firestore';", "import { doc, onSnapshot, collection, query, orderBy, where, updateDoc, limit } from 'firebase/firestore';");
        layout = layout.replace("const q = query(collection(db, 'users', demoUserId, 'notifications'), orderBy('date', 'desc'));", "const q = query(collection(db, 'users', demoUserId, 'notifications'), orderBy('date', 'desc'), limit(30));");
        fs.writeFileSync('src/components/DemoLayout.tsx', layout);
        console.log("DemoLayout limited.");
    }

    // 3. DemoMetrics.tsx
    let met = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');
    if (!met.includes("limit(")) {
        met = met.replace("import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';", "import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';");
        met = met.replace("const q = query(collection(db, 'photos'), where('createdBy', '==', demoUserId));", "const q = query(collection(db, 'photos'), where('createdBy', '==', demoUserId), orderBy('createdAt', 'desc'), limit(50));");
        // Also might need to wrap in try catch in case index is missing, but fallback is just simple limit
        const idx = met.indexOf("const snapshot = await getDocs(q);");
        if (idx !== -1) {
            met = met.substring(0, idx) + `let snapshot;
                try {
                    snapshot = await getDocs(q);
                } catch(e) {
                    const fallbackQ = query(collection(db, 'photos'), where('createdBy', '==', demoUserId), limit(50));
                    snapshot = await getDocs(fallbackQ);
                }\n` + met.substring(idx + "const snapshot = await getDocs(q);".length);
        }
        fs.writeFileSync('src/components/DemoMetrics.tsx', met);
        console.log("DemoMetrics limited.");
    }

    // 4. SuperAdmin.tsx (Limit to 100 for safety)
    let admin = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');
    if (!admin.includes("limit(")) {
        admin = admin.replace("import { doc, setDoc, updateDoc, serverTimestamp, collection, getDocs, getDoc, deleteDoc, addDoc, writeBatch, query, where } from 'firebase/firestore';", "import { doc, setDoc, updateDoc, serverTimestamp, collection, getDocs, getDoc, deleteDoc, addDoc, writeBatch, query, where, limit, orderBy } from 'firebase/firestore';");
        admin = admin.replace("const usersSnap = await getDocs(collection(db, 'users'));", "const usersSnap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(150)));");
        
        // Wrap in try catch for index fallback
        const idx2 = admin.indexOf("const usersSnap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(150)));");
        if (idx2 !== -1) {
            admin = admin.substring(0, idx2) + `let usersSnap;
        try {
            usersSnap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(150)));
        } catch(e) {
            usersSnap = await getDocs(query(collection(db, 'users'), limit(150)));
        }\n` + admin.substring(idx2 + "const usersSnap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(150)));".length);
        }

        fs.writeFileSync('src/components/SuperAdmin.tsx', admin);
        console.log("SuperAdmin limited.");
    }
}

applyLimits();
