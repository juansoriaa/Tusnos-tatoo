import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, updateDoc, serverTimestamp, collection, getDocs, getDoc, deleteDoc, addDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

export default function SuperAdmin() {
  const navigate = useNavigate();
  const [activeMobileTab, setActiveMobileTab] = useState<'dashboard' | 'metrics' | 'earnings' | 'blog'>('dashboard');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogBody, setBlogBody] = useState('');
  const [blogTarget, setBlogTarget] = useState('all');
  const [renewalSearchTerm, setRenewalSearchTerm] = useState('');
  const [blogHistory, setBlogHistory] = useState<{id: number, title: string, body: string, target: string, date: Date}[]>([]);
  const [blogSpecificUser, setBlogSpecificUser] = useState('');
  const [reminderTarget, setReminderTarget] = useState('expiring_monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [topArtistaFilter, setTopArtistaFilter] = useState<'views' | 'whatsappClicks'>('views');
  const [renewalFilter, setRenewalFilter] = useState<'all' | 'trial' | 'monthly' | 'partner' | 'expiring'>('all');
  const [showAllTopArtistas, setShowAllTopArtistas] = useState(false);
  const [showAllRenovaciones, setShowAllRenovaciones] = useState(false);
  const [globalConfig, setGlobalConfig] = useState({
    monthlySubscriptionPrice: 149,
    expenses: []
  });
  const [newExpense, setNewExpense] = useState({ name: '', price: 0, type: 'monthly' });
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    trialUsers: 0,
    monthlyUsers: 0,
    partnerUsers: 0,
  });
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        let total = 0;
        let trial = 0;
        let monthly = 0;
        let partner = 0;
        let usersData: any[] = [];
        
        usersSnap.forEach((doc) => {
          total++;
          const data = doc.data();
          usersData.push(data);
          if (data.subscriptionStatus === 'trial') trial++;
          if (data.subscriptionStatus === 'monthly') monthly++;
          if (data.subscriptionStatus === 'partner') partner++;
        });

        setMetrics({
          totalUsers: total,
          trialUsers: trial,
          monthlyUsers: monthly,
          partnerUsers: partner,
        });
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching metrics", error);
      }
    };
    const fetchConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'config', 'main'));
        if (configDoc.exists()) {
          setGlobalConfig(configDoc.data());
        }
      } catch (error) {
        console.error("Error fetching config", error);
      }
    };
    fetchConfig();
    fetchMetrics();

  }, [isModalOpen]); // refetch when modal closes

  const [detailsModalUser, setDetailsModalUser] = useState<any>(null);

  const handleUpgradeToMonthly = async (userId: string, currentEndsAt: any) => {
    try {
      const endsDate = currentEndsAt?.toDate ? currentEndsAt.toDate() : new Date();
      if (endsDate < new Date()) {
        endsDate.setTime(new Date().getTime());
      }
      endsDate.setDate(endsDate.getDate() + 30);
      
      await updateDoc(doc(db, 'users', userId), {
        subscriptionStatus: 'monthly',
        subscriptionEndsAt: endsDate
      });
      setUsers(users.map(u => u.uid === userId ? {...u, subscriptionStatus: 'monthly', subscriptionEndsAt: { toDate: () => endsDate }} : u));
      if (detailsModalUser?.uid === userId) setDetailsModalUser({...detailsModalUser, subscriptionStatus: 'monthly', subscriptionEndsAt: { toDate: () => endsDate }});
      alert('Plan actualizado a Mensualidad (+30 días)');
    } catch(err) {
      console.error(err);
      alert('Error updating user');
    }
  };

  const handleRenewDays = async (userId: string, currentEndsAt: any, days: number) => {
    try {
      const endsDate = currentEndsAt?.toDate ? currentEndsAt.toDate() : new Date();
      if (endsDate < new Date() && days > 0) {
        endsDate.setTime(new Date().getTime());
      }
      endsDate.setDate(endsDate.getDate() + days);
      
      await updateDoc(doc(db, 'users', userId), {
        subscriptionEndsAt: endsDate
      });
      setUsers(users.map(u => u.uid === userId ? {...u, subscriptionEndsAt: { toDate: () => endsDate }} : u));
      if (detailsModalUser?.uid === userId) setDetailsModalUser({...detailsModalUser, subscriptionEndsAt: { toDate: () => endsDate }});
      alert(`Plan actualizado (${days > 0 ? '+' : ''}${days} días)`);
    } catch(err) {
      console.error(err);
      alert('Error updating user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const isConfirmed = window.confirm("¿Estás seguro que deseas eliminar esta cuenta y toda su colección? Esta acción no se puede deshacer.");
    if (!isConfirmed) return;

    try {
      // Import deleteDoc if not imported
      await deleteDoc(doc(db, 'users', userId));
      // Delete other related subcollections if needed. For now, deleting the user document.
      setUsers(users.filter(u => u.uid !== userId));
      setDetailsModalUser(null);
      alert('Cuenta eliminada exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error eliminando la cuenta');
    }
  };


  const handleResetPassword = async (user: any) => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        customPassword: '123456'
      });
      alert(`Se reseteó la contraseña de ${user.email} a 123456 exitosamente.`);
    } catch (err) {
      console.error(err);
      alert('Error al resetear contraseña');
    }
  };

  const handleSeedFakeUsers = async () => {
    try {
      const fakeUsers = [
        {
          email: 'demo@turnostattoo.com',
          role: 'admin',
          userTag: '@demo_artist',
          displayName: 'Artista de Prueba',
          whatsapp: '+5491112345678',
          subscriptionStatus: 'trial',
          views: 1250,
          whatsappClicks: 45,
          daysLeft: 3 // To set trial expiration
        },
        {
          email: 'jaxxon@ink.com',
          role: 'admin',
          userTag: '@jaxxon_dust',
          displayName: 'Jaxxon Dust',
          whatsapp: '+5491100000001',
          subscriptionStatus: 'monthly',
          views: 3420,
          whatsappClicks: 120,
          daysLeft: -2
        },
        {
          email: 'vera@ink.com',
          role: 'admin',
          userTag: '@vera_knox',
          displayName: 'Vera Knox',
          whatsapp: '+5491100000002',
          subscriptionStatus: 'trial',
          views: 890,
          whatsappClicks: 34,
          daysLeft: 3
        },
        {
          email: 'max@ink.com',
          role: 'admin',
          userTag: '@max_reed',
          displayName: 'Max Reed',
          whatsapp: '+5491100000003',
          subscriptionStatus: 'monthly',
          views: 2100,
          whatsappClicks: 78,
          daysLeft: 5
        },
        {
          email: 'elias@ink.com',
          role: 'admin',
          userTag: '@elias_thorne',
          displayName: 'Elias Thorne',
          whatsapp: '+5491100000004',
          subscriptionStatus: 'partner',
          views: 5600,
          whatsappClicks: 210,
          daysLeft: 3650
        }
      ];

      for (const user of fakeUsers) {
        const newUid = crypto.randomUUID();
        let subscriptionEndsAt = new Date();
        subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + user.daysLeft);

        await setDoc(doc(db, 'users', newUid), {
          uid: newUid,
          email: user.email,
          role: user.role,
          userTag: user.userTag,
          displayName: user.displayName,
          whatsapp: user.whatsapp,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionEndsAt: subscriptionEndsAt,
          views: user.views,
          whatsappClicks: user.whatsappClicks,
          profilePhotoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBMNHOgO0BFPGX5cKluHezzRBDPJueLyUUOSVbMZdAJNASP32jgHA4OlyC47sQI2OSfmnfWWJhsXilZEsOSBqjgJZonLj5pT-FxqVdN9wf0qc9xnw47B_mrLf_EJOGsPCFdm0ezBohArgfCnAGkL4nmXJbY4CXUXnPHC5HN5i25dYpUqlmKCy9E-GOy0FViiulx7v565DyOKMgONwgdsmF5EhQ9sYDmp7SshK7ecWSiMfVG7yXfsm_Dm9BxUhg4h5sZ-clTBdjYBLi",
          backgroundPhotos: [
              "https://lh3.googleusercontent.com/aida-public/AB6AXuD9tmfkfE7QR8rzq1DwqCv6ZHwg1BKfHtc0SAIYpyr1B7XEjYnpYKsNZSKApjn7iYxy27fajqpMp3AfHThndi8RGhtn3w52H2LW9JY4GA0dzEyeuuaEMB3bx5pLtgGtUglT-c7j11gvqaK23h9HU0Q_mXeg6Cfq4t4WCJc8UHY-KZCtl9PSTZlx_J8onCQUiIrfeReh4vWQ_Bg8nafDy7HSg7OrzmlZV5tc45WsJDVRmmwgE08OvzQWqZ3pJlc6Wd_1f6BD0ji9D7do",
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBoS2ZC0vYl1apkGcOhRvhAneP3x1HGeicgjH2XoPh354rwlUh7sNkHFhZzShywlrnEzao7AOBBZBF8woy9SPE1Rk6j8u0UgMxZxXEng7pf1BzooGR74no-wHHdK08zyp6LIy6h6yTXj3eaRDm9b8u68zOCLCPyF6vqVqlie2ZZM42jCx-L9spyBjEA6i17lZIkGra1BJVVL0T83Y7vsBHHDAMfA9XvfLsz9mrsfmOMWS655wsPllTibLD1_alt_GEZLi8m5CLyjeOo"
          ],
          createdAt: serverTimestamp()
        });
        // Add 5 fallback photos for the seeded user's portfolio
        const fallbackPhotos = [
          {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ",
            alt: "A highly detailed black and grey realism tattoo of a lion's face on a human forearm.",
            title: "Detailed black & grey realism",
            tags: ["Realismo", "Blackwork"],
            hours: 12,
            sessions: 2,
            size: "20x15 cm"
          },
          {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5DDAAcFYiq49hBeVBI21d-Kfzr6qKoiRfIXKP1UnRW7YF5GJFA5MFkoXHtdBxy6uEbgH9z0zVWPWxKIEtX3oXemICFI1Ssr7FZ-Hh_OVDjHQ-QLRxMXBp5c4FwHXswrbPE9ZdzVelcUFL0h0nTLuzuWpLR_QRaZBZsyq7srBJaHktN6PcAYY-NQ2d-8FRg_RJ15MYhPUfdaEk_oGzE57hWrd7ZFkT4ldOW1tTIz0PqCqzo5_ALKPhXP1byoz8eiIEM30X9HQLzho",
            alt: "Close-up of a delicate minimalist tattoo of a single rose.",
            title: "Delicate minimalist single rose",
            tags: ["Minimalista"],
            hours: 3,
            sessions: 1,
            size: "8x5 cm"
          },
          {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA",
            alt: "Large-scale blackwork tattoo covering a full back.",
            title: "Large-scale blackwork back piece",
            tags: ["Blackwork", "Tradicional"],
            hours: 24,
            sessions: 4,
            size: "Espalda completa"
          },
          {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYd_bLleuw4yQOy32XLTc-ZA36ZI1Tx20UNajjWgcV5DQKPXzxE6vuXBvD3Ov7hcyCDB0Wpbc1BK7v4CJMIFC3KWS1bBdxzGJUcjSraTSohPMSOjESD5If5O8I8ZxmV0rWCZ_T_ncpPVYMBz9OD9_NXcCjwNkftJNjmowLcbK_jq3Fy-FieRJHky4A0G8SWmDSNGfDrlvoUxmb8aYt9Dxvi2w5uLOR4ir0BxgO2Sh5IfSstId4FI96uowW3Y1Jw1YCCRUk82ep4yPk",
            alt: "Hyper-realistic black and grey realism tattoo",
            title: "Hyper-realistic black & grey",
            tags: ["Realismo", "Blackwork"],
            hours: 15,
            sessions: 3,
            size: "Media manga"
          },
          {
            src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5LMtrwwTSFu95uiU0bVfXq9VmWZIJ10dyJ3Lwbu6VmGCGEnBfZXi0WQlrXz0JAAAXzBurYTXa8IleL_Z1UTW7x4BHigWcVZCarsYy-PDu3G5JOwCsz3c0mgBTVI90e2b4bcw5lLDYzc5mU0qXptlWkjo0e3ynOS0xxfhCjxtvA0Bykbfo3wSX79T_fwcMg4uFHYXGxws2NYoOaKhhgr6J8ErFHQqB5QJSnK9c2zkwmEgiIM-74wbPKlVjQPO8pxETkDa8jrj1OmA",
            alt: "Detailed blackwork owl",
            title: "Detailed blackwork owl",
            tags: ["Blackwork", "Realismo"],
            hours: 8,
            sessions: 2,
            size: "15x15 cm"
          }
        ];
        
        const batch = writeBatch(db);
        for (const photo of fallbackPhotos) {
          const photoRef = doc(collection(db, 'photos'));
          batch.set(photoRef, {
            ...photo,
            createdBy: newUid,
            createdAt: serverTimestamp()
          });
        }
        await batch.commit();

      }
      alert('Usuarios de prueba creados exitosamente');
      // trigger refetch by toggling modal state quickly
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 50);
    } catch (error) {
      console.error(error);
      alert('Error creating fake users');
    }
  };

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'admin',
    userTag: '',
    whatsapp: '',
    subscriptionStatus: 'trial', // default to trial
  });
  
  const handleCrearProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUid = crypto.randomUUID(); // generate a mock uid since we can't create Auth user safely client-side
      
      let subscriptionEndsAt = new Date();
      if (newUserData.subscriptionStatus === 'trial') {
          subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + 7);
      } else if (newUserData.subscriptionStatus === 'monthly') {
          subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + 30);
      } else {
          subscriptionEndsAt.setFullYear(subscriptionEndsAt.getFullYear() + 10); // partner
      }

      await setDoc(doc(db, 'users', newUid), {
        uid: newUid,
        email: newUserData.email,
        role: newUserData.role,
        userTag: newUserData.userTag,
        displayName: newUserData.name,
        whatsapp: newUserData.whatsapp,
        subscriptionStatus: newUserData.subscriptionStatus,
        subscriptionEndsAt: subscriptionEndsAt,
        views: 0,
        whatsappClicks: 0,
        profilePhotoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBMNHOgO0BFPGX5cKluHezzRBDPJueLyUUOSVbMZdAJNASP32jgHA4OlyC47sQI2OSfmnfWWJhsXilZEsOSBqjgJZonLj5pT-FxqVdN9wf0qc9xnw47B_mrLf_EJOGsPCFdm0ezBohArgfCnAGkL4nmXJbY4CXUXnPHC5HN5i25dYpUqlmKCy9E-GOy0FViiulx7v565DyOKMgONwgdsmF5EhQ9sYDmp7SshK7ecWSiMfVG7yXfsm_Dm9BxUhg4h5sZ-clTBdjYBLi",
        backgroundPhotos: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD9tmfkfE7QR8rzq1DwqCv6ZHwg1BKfHtc0SAIYpyr1B7XEjYnpYKsNZSKApjn7iYxy27fajqpMp3AfHThndi8RGhtn3w52H2LW9JY4GA0dzEyeuuaEMB3bx5pLtgGtUglT-c7j11gvqaK23h9HU0Q_mXeg6Cfq4t4WCJc8UHY-KZCtl9PSTZlx_J8onCQUiIrfeReh4vWQ_Bg8nafDy7HSg7OrzmlZV5tc45WsJDVRmmwgE08OvzQWqZ3pJlc6Wd_1f6BD0ji9D7do",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBoS2ZC0vYl1apkGcOhRvhAneP3x1HGeicgjH2XoPh354rwlUh7sNkHFhZzShywlrnEzao7AOBBZBF8woy9SPE1Rk6j8u0UgMxZxXEng7pf1BzooGR74no-wHHdK08zyp6LIy6h6yTXj3eaRDm9b8u68zOCLCPyF6vqVqlie2ZZM42jCx-L9spyBjEA6i17lZIkGra1BJVVL0T83Y7vsBHHDAMfA9XvfLsz9mrsfmOMWS655wsPllTibLD1_alt_GEZLi8m5CLyjeOo"
        ],
        createdAt: serverTimestamp()
      });
      // Add 5 fallback photos for the new user's portfolio
      const fallbackPhotos = [
        {
          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ",
          alt: "A highly detailed black and grey realism tattoo of a lion's face on a human forearm.",
          title: "Detailed black & grey realism",
          tags: ["Realismo", "Blackwork"],
          hours: 12,
          sessions: 2,
          size: "20x15 cm"
        },
        {
          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5DDAAcFYiq49hBeVBI21d-Kfzr6qKoiRfIXKP1UnRW7YF5GJFA5MFkoXHtdBxy6uEbgH9z0zVWPWxKIEtX3oXemICFI1Ssr7FZ-Hh_OVDjHQ-QLRxMXBp5c4FwHXswrbPE9ZdzVelcUFL0h0nTLuzuWpLR_QRaZBZsyq7srBJaHktN6PcAYY-NQ2d-8FRg_RJ15MYhPUfdaEk_oGzE57hWrd7ZFkT4ldOW1tTIz0PqCqzo5_ALKPhXP1byoz8eiIEM30X9HQLzho",
          alt: "Close-up of a delicate minimalist tattoo of a single rose.",
          title: "Delicate minimalist single rose",
          tags: ["Minimalista"],
          hours: 3,
          sessions: 1,
          size: "8x5 cm"
        },
        {
          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA",
          alt: "Large-scale blackwork tattoo covering a full back.",
          title: "Large-scale blackwork back piece",
          tags: ["Blackwork", "Tradicional"],
          hours: 24,
          sessions: 4,
          size: "Espalda completa"
        },
        {
          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYd_bLleuw4yQOy32XLTc-ZA36ZI1Tx20UNajjWgcV5DQKPXzxE6vuXBvD3Ov7hcyCDB0Wpbc1BK7v4CJMIFC3KWS1bBdxzGJUcjSraTSohPMSOjESD5If5O8I8ZxmV0rWCZ_T_ncpPVYMBz9OD9_NXcCjwNkftJNjmowLcbK_jq3Fy-FieRJHky4A0G8SWmDSNGfDrlvoUxmb8aYt9Dxvi2w5uLOR4ir0BxgO2Sh5IfSstId4FI96uowW3Y1Jw1YCCRUk82ep4yPk",
          alt: "Hyper-realistic black and grey realism tattoo",
          title: "Hyper-realistic black & grey",
          tags: ["Realismo", "Blackwork"],
          hours: 15,
          sessions: 3,
          size: "Media manga"
        },
        {
          src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5LMtrwwTSFu95uiU0bVfXq9VmWZIJ10dyJ3Lwbu6VmGCGEnBfZXi0WQlrXz0JAAAXzBurYTXa8IleL_Z1UTW7x4BHigWcVZCarsYy-PDu3G5JOwCsz3c0mgBTVI90e2b4bcw5lLDYzc5mU0qXptlWkjo0e3ynOS0xxfhCjxtvA0Bykbfo3wSX79T_fwcMg4uFHYXGxws2NYoOaKhhgr6J8ErFHQqB5QJSnK9c2zkwmEgiIM-74wbPKlVjQPO8pxETkDa8jrj1OmA",
          alt: "Detailed blackwork owl",
          title: "Detailed blackwork owl",
          tags: ["Blackwork", "Realismo"],
          hours: 8,
          sessions: 2,
          size: "15x15 cm"
        }
      ];
      
      const batch = writeBatch(db);
      for (const photo of fallbackPhotos) {
        const photoRef = doc(collection(db, 'photos'));
        batch.set(photoRef, {
          ...photo,
          createdBy: newUid,
          createdAt: serverTimestamp()
        });
      }
      await batch.commit();

      setIsModalOpen(false);
      setNewUserData({ name: '', email: '', role: 'admin', userTag: '', whatsapp: '', subscriptionStatus: 'trial' });
      alert('Perfil de Artista creado con éxito.');
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Error creating profile.');
    }
  };


  const estimatedRevenue = metrics.monthlyUsers * (globalConfig?.monthlySubscriptionPrice || 0);
  const totalMonthlyExpenses = (globalConfig?.expenses || []).reduce((acc, curr) => acc + (curr.type === 'monthly' ? Number(curr.price) : Number(curr.price) / 12), 0);
  const netProfit = estimatedRevenue - totalMonthlyExpenses;

  const handleSaveConfig = async (e) => {
    if (e) e.preventDefault();
    setIsSavingConfig(true);
    try {
      await setDoc(doc(db, 'config', 'main'), globalConfig);
      alert('Configuración guardada correctamente.');
    } catch (error) {
      console.error("Error saving config", error);
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleAddExpense = () => {
    if (!newExpense.name || newExpense.price <= 0) return;
    setGlobalConfig({
      ...globalConfig,
      expenses: [...(globalConfig.expenses || []), { ...newExpense, id: Date.now().toString() }]
    });
    setNewExpense({ name: '', price: 0, type: 'monthly' });
  };

  const handleRemoveExpense = (id) => {
    setGlobalConfig({
      ...globalConfig,
      expenses: (globalConfig.expenses || []).filter(e => e.id !== id)
    });
  };


  const handleSendReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetUsers = [];
    let title = "";
    let body = "";

    if (reminderTarget === 'expiring_monthly') {
        targetUsers = users.filter(u => {
            if (u.subscriptionStatus !== 'monthly') return false;
            let daysLeft = 0;
            if (u.subscriptionEndsAt && u.subscriptionEndsAt.toDate) {
                const diffTime = u.subscriptionEndsAt.toDate().getTime() - new Date().getTime();
                daysLeft = diffTime < 0 ? -Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24)) : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            return daysLeft <= 3;
        });
        title = "¡Atención! Tu plan mensual está por expirar";
        body = "Tu plan mensual está a punto de caducar en los próximos días. Para no perder acceso a todas las funcionalidades premium de Ink Architect, por favor renueva tu suscripción a la brevedad.";
    } else if (reminderTarget === 'trial') {
        targetUsers = users.filter(u => u.subscriptionStatus === 'trial');
        title = "¡Mejora tu plan hoy mismo!";
        body = "Estás utilizando la versión de prueba gratis. Para acceder a herramientas avanzadas y subir más obras sin límites, pásate al plan mensual y aprovecha todos los beneficios de Ink Architect.";
    }

    if (targetUsers.length === 0) {
      alert('No se encontraron usuarios para este filtro.');
      return;
    }

    try {
        for (const u of targetUsers) {
          await addDoc(collection(db, 'users', u.uid, 'notifications'), {
            title: title,
            body: body,
            date: serverTimestamp(),
            read: false
          });
        }
        alert(`Recordatorios enviados a ${targetUsers.length} usuario(s).`);
    } catch (err) {
        console.error(err);
        alert('Error enviando recordatorios');
    }
  };

  const handleSendBlog = async (e: any) => {
    e.preventDefault();
    if (!blogTitle || !blogBody) return;
    
    try {
      let targetUsers = [];
      if (blogTarget === 'all') {
        targetUsers = users;
      } else if (blogTarget === 'monthly' || blogTarget === 'trial') {
        targetUsers = users.filter(u => u.subscriptionStatus === blogTarget);
      } else if (blogTarget === 'specific') {
        const lowerSearch = blogSpecificUser.toLowerCase();
        targetUsers = users.filter(u => 
          (u.displayName && u.displayName.toLowerCase().includes(lowerSearch)) || 
          (u.userTag && u.userTag.toLowerCase().includes(lowerSearch)) ||
          (u.email && u.email.toLowerCase().includes(lowerSearch))
        );
      }

      if (targetUsers.length === 0) {
        alert('No se encontraron usuarios para este filtro.');
        return;
      }

      // Send to each user's notifications subcollection
      for (const u of targetUsers) {
        await addDoc(collection(db, 'users', u.uid, 'notifications'), {
          title: blogTitle,
          body: blogBody,
          date: serverTimestamp(),
          read: false
        });
      }

      const targetDesc = blogTarget === 'specific' ? `Usuario: ${blogSpecificUser}` : (blogTarget === 'all' ? 'Todos' : blogTarget);
      alert(`Notificación "${blogTitle}" enviada a ${targetUsers.length} usuario(s).`);
      
      setBlogHistory([{ id: Date.now(), title: blogTitle, body: blogBody, target: targetDesc, date: new Date() }, ...blogHistory]);
      setBlogTitle('');
      setBlogBody('');
      setBlogSpecificUser('');
    } catch (err) {
      console.error(err);
      alert('Error enviando notificación');
    }
  };

  const handleDeleteBlog = (id: number) => {
    setBlogHistory(blogHistory.filter(b => b.id !== id));
  };

  return (

    <div className="bg-deep-black text-on-surface font-body-md text-body-md min-h-screen w-full flex overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Atmospheric Glow */}
      <div className="fixed top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none z-0 mix-blend-screen"></div>
      
      {/* Mobile Top Navigation (md:hidden) */}
      <nav className="md:hidden bg-surface/70 backdrop-blur-md text-primary font-body-md text-body-md fixed top-0 w-full z-50 border-b border-outline-variant/20 flex justify-between items-center px-margin-mobile h-16">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined">menu</span>
          <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">INK ARCHITECT</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer scale-95 ease-in-out">notifications</span>
          <img alt="Super Admin Avatar" className="w-8 h-8 rounded-full border border-outline-variant/50 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChKoYdVzBsSRbkqUR0XLZXk-rHJKYqy-NlNShuUWtQWzoXWIFzzFZMi_bgMlhEM5U8bk_Irq29b4LY8RASAPvDgwf6w5lDVDSxyB5hS5ZH6_c5I4XGTs5AJl9esdxpaVdLw1vJYexXfExoHJB3KfB_lJJZ2VZ3qP49SKCtGb0-B2Q4_bv3__mm22EECRew2J_d7kfNL0kFkqM2f2Be0lwtCI6dGPdgom9B98H5JEFSuUFkossMWOtC2JwVvhYVGxJue_DgNX6utzm2"/>
        </div>
      </nav>

      {/* Desktop Side Navigation (hidden md:flex) */}
      <aside className="hidden md:flex flex-col py-16 bg-deep-black fixed left-0 top-0 h-screen w-sidebar-width border-r border-outline-variant/20 z-40">
        {/* Brand Header */}
        <div className="px-6 mb-10 flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>architecture</span>
            </div>
            <span className="font-headline-lg text-headline-lg text-primary tracking-tighter leading-none">Portal Admin</span>
          </div>
          <span className="font-caption text-caption text-secondary uppercase tracking-widest">Control Global</span>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-1 px-3">
          {/* Active Tab */}
          <a className="flex items-center gap-3 px-3 py-2 rounded text-primary bg-surface-container-high border-l-2 border-primary group" href="#">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="font-label-md text-label-md">Resumen</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 group" href="#">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">groups</span>
            <span className="font-label-md text-label-md">Gestión de Artistas</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 group" href="#">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">monitoring</span>
            <span className="font-label-md text-label-md">Rendimiento</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 group" href="#">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">autorenew</span>
            <span className="font-label-md text-label-md">Renovaciones</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 group" href="#">
            <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">history</span>
            <span className="font-label-md text-label-md">Audit Log</span>
          </a>
        </nav>
        
        {/* Footer Links */}
        <div className="px-3 pb-6 flex flex-col gap-1 mt-auto">
          <a className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 group" href="#">
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span className="font-label-md text-label-md">Support</span>
          </a>
          <button onClick={() => navigate('/')} className="flex items-center gap-3 px-3 py-2 rounded text-secondary hover:text-on-surface hover:bg-surface-container-low transition-all duration-200 group w-full text-left">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-label-md text-label-md">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 overflow-y-auto h-full relative z-10 md:ml-[256px] pt-20 md:pt-0">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 pb-32">
          {/* Page Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">Platform Resumen</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Monitor global network health, manage high-performing artists, and configure structural parameters.</p>
            </div>
            <div className="flex items-center gap-4 text-secondary font-caption text-caption">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> Oct 24, 2026</span>
              <span className="h-4 w-px bg-outline-variant/50"></span>
              <span className="flex items-center gap-1 text-primary"><span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>fiber_manual_record</span> System Nominal</span>
            </div>
          </header>

          {/* Zone 1: Creation & Quick Actions (Bento Grid) */}
          <div className={`flex flex-col gap-gutter ${activeMobileTab === "dashboard" ? "flex" : "hidden"} md:flex`}>
          <section className="mb-gutter">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {/* Quick Action: Crear New */}
              <div className="col-span-2 md:col-span-2 lg:col-span-1 rounded-xl bg-gradient-to-br from-primary-container to-surface-container border border-outline-variant/30 p-4 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 mb-4">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-primary text-sm">person_add</span>
                  </div>
                  <h2 className="font-headline-sm text-on-surface mb-1 text-sm font-bold">Registrar</h2>
                  <p className="font-caption text-caption text-on-surface-variant text-[10px] leading-tight">Agrega talento.</p>
                </div>
                <div className="flex flex-col gap-2 w-full relative z-10 mt-auto">
                  <button onClick={() => setIsModalOpen(true)} className="w-full py-1.5 px-2 bg-primary text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-1 hover:bg-primary-fixed transition-colors active:scale-95 duration-200 ease-in-out">
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    Crear
                  </button>
                  
                </div>
              </div>

              {/* Metric 1 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Usuarios</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">group</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{metrics.totalUsers}</div>
                  <div className="flex items-center gap-1 text-primary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span>
                    <span>Registrados</span>
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Tatuadores Pro</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{metrics.monthlyUsers}</div>
                  <div className="flex items-center gap-1 text-primary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">stars</span>
                    <span>Mensual</span>
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Partners</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">handshake</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{metrics.partnerUsers}</div>
                  <div className="flex items-center gap-1 text-primary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">verified_user</span>
                    <span>Vitalicios</span>
                  </div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">En Prueba</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">schedule</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{metrics.trialUsers}</div>
                  <div className="flex items-center gap-1 text-secondary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">timer</span>
                    <span>Pendientes</span>
                  </div>
                </div>
              </div>

              {/* Metric 5 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Tiempo Real</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">podcasts</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1 text-primary">12</div>
                  <div className="flex items-center gap-1 text-primary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">sensors</span>
                    <span>Conectados</span>
                  </div>
                </div>
              </div>

              {/* Metric 6 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Externos</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">public</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{Math.max(0, metrics.totalUsers - (metrics.monthlyUsers + metrics.partnerUsers + metrics.trialUsers))}</div>
                  <div className="flex items-center gap-1 text-secondary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">person_outline</span>
                    <span>Clientes</span>
                  </div>
                </div>
              </div>

              {/* Metric 7 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Activos</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">local_fire_department</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{metrics.monthlyUsers + metrics.partnerUsers + metrics.trialUsers}</div>
                  <div className="flex items-center gap-1 text-secondary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">draw</span>
                    <span>Tatuadores</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          </div>

          {/* Zone 2: Supervisión de Rendimiento */}
          <div className={`flex flex-col gap-gutter ${activeMobileTab === "metrics" ? "flex" : "hidden"} md:flex mt-6`}>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-gutter">
            {/* Renovaciones Table */}
            <div className="lg:col-span-2 glass-panel border border-outline-variant/20 rounded-xl p-8 overflow-x-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Gestión de Renovaciones</h2>
                  <p className="font-caption text-caption text-on-surface-variant">Acción requerida para ciclos de facturación próximos.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-48">
                      <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-secondary text-[16px]">search</span>
                      <input
                        type="text"
                        placeholder="Buscar usuario..."
                        value={renewalSearchTerm}
                        onChange={(e) => setRenewalSearchTerm(e.target.value)}
                        className="bg-deep-black border border-outline-variant/50 rounded text-caption text-on-surface p-2 pl-8 outline-none w-full focus:border-primary transition-colors"
                      />
                    </div>
                    <select 
                      value={renewalFilter}
                      onChange={(e) => setRenewalFilter(e.target.value as any)}
                      className="bg-deep-black border border-outline-variant/50 rounded text-caption text-secondary p-2 outline-none h-full shrink-0"
                    >
                      <option value="all">Todos</option>
                      <option value="trial">Trials</option>
                      <option value="monthly">Mensual</option>
                      <option value="partner">Partners</option>
                      <option value="expiring">Próximos</option>
                    </select>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {/* header row for desktop */}
                <div className="hidden md:grid grid-cols-4 gap-4 border-b border-outline-variant/20 pb-3 mb-2 font-caption text-caption text-secondary uppercase tracking-widest font-normal">
                  <div>Artista</div>
                  <div>Plan</div>
                  <div>Estado</div>
                  <div>Tiempo Restante</div>
                </div>
                {users.filter(u => {
                   if (renewalFilter === 'all') return true;
                   if (renewalFilter === 'trial') return u.subscriptionStatus === 'trial';
                   if (renewalFilter === 'monthly') return u.subscriptionStatus === 'monthly';
                   if (renewalFilter === 'partner') return u.subscriptionStatus === 'partner';
                   if (renewalSearchTerm) {
                       const term = renewalSearchTerm.toLowerCase();
                       if (!u.displayName?.toLowerCase().includes(term) && !u.email?.toLowerCase().includes(term) && !u.userTag?.toLowerCase().includes(term)) return false;
                   }
                   if (renewalFilter === 'expiring') {
                       if (u.subscriptionStatus === 'partner') return false;
                       let daysLeft = 0;
                       if (u.subscriptionEndsAt && u.subscriptionEndsAt.toDate) {
                           const diffTime = u.subscriptionEndsAt.toDate().getTime() - new Date().getTime();
                           daysLeft = diffTime < 0 ? -Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24)) : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       }
                       return daysLeft <= 3;
                   }
                   return true;
                }).slice(0, showAllRenovaciones ? undefined : 7).map((user) => {
                  const isPartner = user.subscriptionStatus === 'partner';
                  let daysLeft = 0;
                  if (user.subscriptionEndsAt && user.subscriptionEndsAt.toDate) {
                      const diffTime = user.subscriptionEndsAt.toDate().getTime() - new Date().getTime();
                      daysLeft = diffTime < 0 ? -Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24)) : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  }
                  const statusColor = isPartner ? 'text-primary bg-primary/10 border-primary/20' : 
                                      daysLeft <= 0 ? 'text-error bg-error/10 border-error/20' : 
                                      daysLeft <= 3 ? 'text-secondary bg-surface-variant border-outline-variant/50' : 
                                      'text-primary bg-primary/10 border-primary/20';

                  return (
                    <div key={user.uid} onClick={() => setDetailsModalUser(user)} className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center p-3 -mx-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer border-b border-outline-variant/10 md:border-none group">
                      <div className="flex items-center gap-3">
                        <img alt="Artista Avatar" className="w-10 h-10 rounded bg-surface object-cover" src={user.profilePhotoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBBMNHOgO0BFPGX5cKluHezzRBDPJueLyUUOSVbMZdAJNASP32jgHA4OlyC47sQI2OSfmnfWWJhsXilZEsOSBqjgJZonLj5pT-FxqVdN9wf0qc9xnw47B_mrLf_EJOGsPCFdm0ezBohArgfCnAGkL4nmXJbY4CXUXnPHC5HN5i25dYpUqlmKCy9E-GOy0FViiulx7v565DyOKMgONwgdsmF5EhQ9sYDmp7SshK7ecWSiMfVG7yXfsm_Dm9BxUhg4h5sZ-clTBdjYBLi"}/>
                        <div className="flex flex-col">
                          <span className="text-on-surface font-bold md:font-normal">{user.displayName || user.email}</span>
                          <div className="flex items-center gap-2 md:hidden">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-bold tracking-widest ${statusColor}`}>
                                {isPartner ? 'ACTIVE' : daysLeft <= 0 ? 'EXPIRED' : user.subscriptionStatus === 'trial' ? 'TRIAL' : 'ACTIVE'}
                            </span>
                            <span className="text-secondary text-xs capitalize">{user.subscriptionStatus} • {isPartner ? '∞' : daysLeft < 0 ? `Hace ${Math.abs(daysLeft)} días` : `Quedan ${daysLeft} días`}</span>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block text-on-surface-variant capitalize">{user.subscriptionStatus}</div>
                      <div className="hidden md:block">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full border text-[10px] font-bold tracking-widest ${statusColor}`}>
                          {isPartner ? 'ACTIVE' : daysLeft <= 0 ? 'EXPIRED' : user.subscriptionStatus === 'trial' ? 'TRIAL' : 'ACTIVE'}
                        </span>
                      </div>
                      <div className={`hidden md:block ${daysLeft <= 3 && !isPartner ? 'text-error' : 'text-on-surface'}`}>
                        {isPartner ? '∞' : daysLeft < 0 ? `-${Math.abs(daysLeft)} Days` : `${daysLeft} Days`}
                      </div>
                    </div>
                  );
                })}
                {users.length === 0 && (
                    <div className="py-4 text-center text-secondary">No hay usuarios</div>
                )}
                {users.filter(u => {
                   if (renewalFilter === 'all') return true;
                   if (renewalFilter === 'trial') return u.subscriptionStatus === 'trial';
                   if (renewalFilter === 'monthly') return u.subscriptionStatus === 'monthly';
                   if (renewalFilter === 'partner') return u.subscriptionStatus === 'partner';
                   if (renewalSearchTerm) {
                       const term = renewalSearchTerm.toLowerCase();
                       if (!u.displayName?.toLowerCase().includes(term) && !u.email?.toLowerCase().includes(term) && !u.userTag?.toLowerCase().includes(term)) return false;
                   }
                   if (renewalFilter === 'expiring') {
                       if (u.subscriptionStatus === 'partner') return false;
                       let daysLeft = 0;
                       if (u.subscriptionEndsAt && u.subscriptionEndsAt.toDate) {
                           const diffTime = u.subscriptionEndsAt.toDate().getTime() - new Date().getTime();
                           daysLeft = diffTime < 0 ? -Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24)) : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       }
                       return daysLeft <= 3;
                   }
                   return true;
                }).length > 7 && (
                  <button onClick={() => setShowAllRenovaciones(!showAllRenovaciones)} className="text-primary hover:text-primary-fixed transition-colors text-sm font-bold text-center mt-2 py-2 w-full">
                    {showAllRenovaciones ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
            </div>
            {/* Lista de Mejores Artistas */}
            <div className="lg:col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-md text-headline-md text-on-surface">Mejores Artistas</h2>
                <select 
                  value={topArtistaFilter}
                  onChange={(e) => setTopArtistaFilter(e.target.value as 'views' | 'whatsappClicks')}
                  className="bg-deep-black border border-outline-variant/50 rounded text-caption text-secondary p-1 outline-none"
                >
                  <option value="views">Más Visitados</option>
                  <option value="whatsappClicks">Clicks de WhatsApp</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-4">
                {users.slice().sort((a, b) => (b[topArtistaFilter] || 0) - (a[topArtistaFilter] || 0)).slice(0, showAllTopArtistas ? undefined : 7).map((user, idx) => (
                  <React.Fragment key={user.uid}>
                    <div className="flex items-center gap-4 p-2 -mx-2 rounded hover:bg-surface-container-low transition-colors cursor-pointer group">
                      <img alt="Artista Avatar" className="w-12 h-12 rounded bg-surface border border-outline-variant/50 object-cover" src={user.profilePhotoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBBMNHOgO0BFPGX5cKluHezzRBDPJueLyUUOSVbMZdAJNASP32jgHA4OlyC47sQI2OSfmnfWWJhsXilZEsOSBqjgJZonLj5pT-FxqVdN9wf0qc9xnw47B_mrLf_EJOGsPCFdm0ezBohArgfCnAGkL4nmXJbY4CXUXnPHC5HN5i25dYpUqlmKCy9E-GOy0FViiulx7v565DyOKMgONwgdsmF5EhQ9sYDmp7SshK7ecWSiMfVG7yXfsm_Dm9BxUhg4h5sZ-clTBdjYBLi"}/>
                      <div className="flex-1">
                        <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">{user.displayName}</h3>
                        <p className="font-caption text-caption text-on-surface-variant">{user.userTag}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-label-md text-label-md text-on-surface">{user[topArtistaFilter] || 0}</div>
                        <div className="font-caption text-caption text-secondary">{topArtistaFilter === 'views' ? 'Visitas' : 'Clicks WA'}</div>
                      </div>
                    </div>
                    {idx < Math.min(users.length, showAllTopArtistas ? users.length : 7) - 1 && <div className="h-px w-full bg-outline-variant/10"></div>}
                  </React.Fragment>
                ))}
                {users.length === 0 && <div className="text-secondary text-caption">No hay artistas registrados.</div>}
                {users.length > 7 && (
                  <button onClick={() => setShowAllTopArtistas(!showAllTopArtistas)} className="text-primary hover:text-primary-fixed transition-colors text-sm font-bold text-center mt-2">
                    {showAllTopArtistas ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
              </div>
            </div>
          </section>
          <section className="glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col mb-gutter">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-error">notification_important</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Enviar Recordatorios Automáticos</h2>
            </div>
            <form onSubmit={handleSendReminder} className="flex flex-col md:flex-row gap-4 items-end">
               <div className="flex flex-col gap-2 w-full md:w-1/2">
                 <label className="font-label-md text-label-md text-secondary">Seleccionar Grupo de Usuarios</label>
                 <select 
                   value={reminderTarget}
                   onChange={(e) => setReminderTarget(e.target.value)}
                   className="bg-deep-black border border-outline-variant/50 rounded p-2 text-sm text-on-surface focus:border-primary outline-none"
                 >
                   <option value="expiring_monthly">Usuarios Mensuales Próximos a Vencer (3 días o menos)</option>
                   <option value="trial">Usuarios en Prueba Gratis (Invitación a Renovar)</option>
                 </select>
               </div>
               <button type="submit" className="w-full md:w-auto px-6 py-2 bg-error/10 text-error border border-error/20 rounded font-bold uppercase tracking-widest text-sm hover:bg-error/20 transition-colors flex justify-center items-center gap-2 h-[42px]">
                 <span className="material-symbols-outlined text-[18px]">send</span>
                 Enviar Recordatorios
               </button>
            </form>
            <div className="mt-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/10 text-sm text-on-surface-variant flex flex-col gap-2">
               <p><span className="font-bold text-on-surface">Mensaje que se enviará:</span></p>
               {reminderTarget === 'expiring_monthly' ? (
                  <>
                    <p className="font-bold text-error">¡Atención! Tu plan mensual está por expirar</p>
                    <p>Tu plan mensual está a punto de caducar en los próximos días. Para no perder acceso a todas las funcionalidades premium de Ink Architect, por favor renueva tu suscripción a la brevedad.</p>
                  </>
               ) : (
                  <>
                    <p className="font-bold text-primary">¡Mejora tu plan hoy mismo!</p>
                    <p>Estás utilizando la versión de prueba gratis. Para acceder a herramientas avanzadas y subir más obras sin límites, pásate al plan mensual y aprovecha todos los beneficios de Ink Architect.</p>
                  </>
               )}
            </div>
          </section>

          </div>

          {/* Zone 3: Ingresos y Configuración */}
          <div className={`flex flex-col gap-gutter ${activeMobileTab === "earnings" ? "flex" : "hidden"} md:flex mt-6`}>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Proyección de Ganancias */}
            <div className="lg:col-span-2 glass-panel border border-outline-variant/20 rounded-xl p-8 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Proyección de Ganancias (Mensual)</h2>
                  <p className="font-caption text-caption text-on-surface-variant">Estimación basada en los ingresos de suscripciones y gastos de plataforma.</p>
                </div>
                <span className="material-symbols-outlined text-primary">analytics</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-deep-black border border-outline-variant/20 rounded p-6 flex flex-col items-center justify-center text-center">
                   <div className="text-secondary font-caption text-caption uppercase tracking-widest mb-2">Ingresos Estimados</div>
                   <div className="text-3xl text-on-surface font-bold">${(estimatedRevenue || 0).toLocaleString()}</div>
                   <div className="text-xs text-secondary mt-1">{metrics.monthlyUsers} suscripciones</div>
                </div>
                <div className="bg-deep-black border border-outline-variant/20 rounded p-6 flex flex-col items-center justify-center text-center">
                   <div className="text-secondary font-caption text-caption uppercase tracking-widest mb-2">Gastos Estimados</div>
                   <div className="text-3xl text-error font-bold">${(totalMonthlyExpenses || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                   <div className="text-xs text-secondary mt-1">{(globalConfig?.expenses || []).length} elementos activos</div>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded p-6 flex flex-col items-center justify-center text-center">
                   <div className="text-primary font-caption text-caption uppercase tracking-widest mb-2">Ganancia Neta</div>
                   <div className="text-3xl text-primary font-bold">${(netProfit || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                   <div className="text-xs text-primary mt-1">Beneficio proyectado</div>
                </div>
              </div>
            </div>

            {/* Formulario de Configuración de Tarifas y Gastos */}
            <div className="lg:col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Configuración y Gastos</h2>
              </div>
              
              <form onSubmit={handleSaveConfig} className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2">
                
                {/* Input Group */}
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-secondary">Precio Suscripción Mensual</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">$</span>
                    <input 
                       className="w-full bg-deep-black border border-outline-variant/50 rounded p-2 pl-8 text-on-surface focus:outline-none focus:border-primary transition-all" 
                       type="number" 
                       value={globalConfig?.monthlySubscriptionPrice || ''}
                       onChange={(e) => setGlobalConfig({...globalConfig, monthlySubscriptionPrice: Number(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="h-px w-full bg-outline-variant/20 my-2"></div>

                <div className="flex justify-between items-center">
                    <label className="font-label-md text-label-md text-secondary">Gastos de Plataforma</label>
                </div>

                <div className="flex flex-col gap-2">
                    {(globalConfig?.expenses || []).map(exp => (
                        <div key={exp.id} className="flex justify-between items-center bg-deep-black border border-outline-variant/20 rounded p-2">
                            <div className="flex flex-col">
                                <span className="text-on-surface text-sm font-bold">{exp.name}</span>
                                <span className="text-secondary text-xs capitalize">{exp.type === 'monthly' ? 'Mensual' : 'Anual'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-error font-bold text-sm">${(Number(exp.price) || 0).toLocaleString()}</span>
                                <button type="button" onClick={() => handleRemoveExpense(exp.id)} className="text-secondary hover:text-error transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                    {(globalConfig?.expenses || []).length === 0 && (
                        <div className="text-xs text-secondary text-center py-2">No hay gastos registrados.</div>
                    )}
                </div>

                <div className="flex flex-col gap-2 mt-2 bg-surface p-3 rounded border border-outline-variant/10">
                    <div className="text-xs text-on-surface font-bold uppercase mb-1">Agregar Gasto</div>
                    <input 
                        type="text" 
                        placeholder="Nombre (ej. Dominio)" 
                        className="w-full bg-deep-black border border-outline-variant/50 rounded p-2 text-sm text-on-surface focus:border-primary outline-none"
                        value={newExpense.name}
                        onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                    />
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            placeholder="Precio" 
                            className="w-1/2 bg-deep-black border border-outline-variant/50 rounded p-2 text-sm text-on-surface focus:border-primary outline-none"
                            value={newExpense.price || ''}
                            onChange={(e) => setNewExpense({...newExpense, price: Number(e.target.value)})}
                        />
                        <select 
                            className="w-1/2 bg-deep-black border border-outline-variant/50 rounded p-2 text-sm text-on-surface focus:border-primary outline-none"
                            value={newExpense.type}
                            onChange={(e) => setNewExpense({...newExpense, type: e.target.value})}
                        >
                            <option value="monthly">Mensual</option>
                            <option value="annual">Anual</option>
                        </select>
                    </div>
                    <button type="button" onClick={handleAddExpense} className="w-full mt-1 py-1.5 bg-surface-variant text-primary rounded text-sm hover:bg-surface-bright transition-colors font-bold">
                        Añadir
                    </button>
                </div>
                
                <div className="mt-auto pt-4 border-t border-outline-variant/20 flex gap-3">
                  <button 
                     className="flex-1 py-2 px-4 bg-primary text-on-primary hover:bg-primary-fixed transition-colors rounded font-label-md text-label-md flex items-center justify-center gap-2 disabled:opacity-50" 
                     type="submit"
                     disabled={isSavingConfig}
                  >
                     {isSavingConfig ? 'Guardando...' : 'Guardar Configuración'}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Calendario de Ganancias */}
          <section className="grid grid-cols-1 mt-6">
            <div className="glass-panel border border-outline-variant/20 rounded-xl p-8">
                <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Historial de Ganancias</h2>
                    <p className="font-caption text-caption text-on-surface-variant">Rendimiento mensual histórico de la plataforma.</p>
                </div>
                <span className="material-symbols-outlined text-primary">calendar_month</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map((month, idx) => {
                        const baseVal = netProfit > 0 ? netProfit : 3000;
                        const rnd = (Math.sin(idx + 1) * 0.2 + 0.8) * baseVal; 
                        return (
                        <div key={month} className="bg-deep-black border border-outline-variant/20 rounded p-4 flex flex-col items-center justify-center group hover:border-primary/50 transition-colors">
                            <span className="text-secondary font-caption text-[10px] uppercase tracking-widest mb-2">{month} 2026</span>
                            <span className="text-xl text-on-surface font-bold">${rnd.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                            <div className="flex items-center gap-1 mt-2 text-[10px] text-primary">
                                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                                <span>+{Math.floor((idx + 1) * 2 + 5)}%</span>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
          </section>

          </div>

          {/* Zone 4: Blog & Notificaciones */}
          <div className={`flex flex-col gap-gutter ${activeMobileTab === 'blog' ? 'flex' : 'hidden'} md:flex mt-6`}>
            <section className="glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">campaign</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Plantilla de Notificaciones</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Send Form */}
                <form onSubmit={handleSendBlog} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-secondary">Destinatarios</label>
                    <select 
                      value={blogTarget}
                      onChange={(e) => setBlogTarget(e.target.value)}
                      className="bg-deep-black border border-outline-variant/50 rounded p-2 text-sm text-on-surface focus:border-primary outline-none"
                    >
                      <option value="all">Todos los usuarios ({metrics.totalUsers || 0})</option>
                      <option value="monthly">Usuarios Pro ({metrics.monthlyUsers || 0})</option>
                      <option value="trial">Usuarios en Trial ({metrics.trialUsers || 0})</option>
                      <option value="specific">Usuario Específico...</option>
                    </select>
                  </div>

                  {blogTarget === 'specific' && (
                  <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                    <label className="font-label-md text-label-md text-secondary">Buscar Usuario</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
                      <input 
                        type="text" 
                        placeholder="Ej. Juan Pérez o @juanp" 
                        value={blogSpecificUser}
                        onChange={(e) => setBlogSpecificUser(e.target.value)}
                        className="w-full bg-deep-black border border-outline-variant/50 rounded p-3 pl-10 text-on-surface focus:outline-none focus:border-primary transition-all"
                        required
                        list="user-search-list"
                      />
                      <datalist id="user-search-list">
                        {users.map(u => (
                            <option key={u.uid} value={u.displayName || u.userTag || u.email}>
                                {u.displayName || u.userTag} ({u.email})
                            </option>
                        ))}
                      </datalist>
                    </div>
                  </div>
                )}
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-secondary">Título del mensaje</label>
                    <input 
                      type="text" 
                      placeholder="Ej. Nueva actualización disponible" 
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      className="w-full bg-deep-black border border-outline-variant/50 rounded p-3 text-on-surface focus:outline-none focus:border-primary transition-all"
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-secondary">Contenido del mensaje</label>
                    <textarea 
                      rows={4}
                      placeholder="Escribe el cuerpo de la notificación aquí..."
                      value={blogBody}
                      onChange={(e) => setBlogBody(e.target.value)}
                      className="w-full bg-deep-black border border-outline-variant/50 rounded p-3 text-on-surface focus:outline-none focus:border-primary transition-all resize-none"
                      required
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="mt-2 py-3 px-4 bg-primary text-on-primary hover:bg-primary-fixed transition-colors rounded font-label-md text-label-md flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    Enviar Notificación
                  </button>
                </form>

                {/* History */}
                <div className="flex flex-col gap-4 border-t md:border-t-0 md:border-l border-outline-variant/20 pt-6 md:pt-0 md:pl-8">
                  <h3 className="font-label-lg text-secondary uppercase tracking-widest text-xs mb-2">Historial de Envíos</h3>
                  {blogHistory.length === 0 ? (
                    <div className="text-secondary text-sm italic">No hay mensajes enviados.</div>
                  ) : (
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[400px] pr-2">
                      {blogHistory.map(b => (
                        <div key={b.id} className="bg-deep-black border border-outline-variant/20 rounded p-3 flex flex-col gap-2 relative group">
                          <button onClick={() => handleDeleteBlog(b.id)} className="absolute top-2 right-2 text-secondary hover:text-error opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                          <div className="text-xs text-primary font-bold">{b.target}</div>
                          <div className="text-on-surface font-bold text-sm">{b.title}</div>
                          <div className="text-secondary text-xs line-clamp-2">{b.body}</div>
                          <div className="text-[10px] text-secondary/50 mt-1">{b.date.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>


      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-md border-t border-outline-variant/20 z-50 flex items-center justify-around h-16 pb-safe">
        <button 
          onClick={() => setActiveMobileTab('dashboard')} 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeMobileTab === 'dashboard' ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: activeMobileTab === 'dashboard' ? "'FILL' 1" : "'FILL' 0"}}>dashboard</span>
          <span className="text-[10px] font-bold">Inicio</span>
        </button>
        <button 
          onClick={() => setActiveMobileTab('metrics')} 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeMobileTab === 'metrics' ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: activeMobileTab === 'metrics' ? "'FILL' 1" : "'FILL' 0"}}>monitoring</span>
          <span className="text-[10px] font-bold">Métricas</span>
        </button>
        <div className="relative w-full h-full flex justify-center">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="absolute -top-5 flex items-center justify-center w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_4px_20px_rgba(5,77,68,0.4)] hover:scale-105 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[32px]">add</span>
          </button>
        </div>
        <button 
          onClick={() => setActiveMobileTab('earnings')} 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeMobileTab === 'earnings' ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: activeMobileTab === 'earnings' ? "'FILL' 1" : "'FILL' 0"}}>account_balance_wallet</span>
          <span className="text-[10px] font-bold">Ganancias</span>
        </button>
        <button 
          onClick={() => setActiveMobileTab('blog')} 
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${activeMobileTab === 'blog' ? 'text-primary' : 'text-secondary hover:text-on-surface'}`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: activeMobileTab === 'blog' ? "'FILL' 1" : "'FILL' 0"}}>campaign</span>
          <span className="text-[10px] font-bold">Blog</span>
        </button>
      </nav>

      {/* Registrar Artista Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline-variant/30 rounded-xl max-w-md w-full p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Crear Perfil de Artista</h2>
            <form onSubmit={handleCrearProfile} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-secondary">Name</label>
                <input 
                  required
                  type="text" 
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                  className="bg-deep-black border border-outline-variant/50 rounded p-2 text-on-surface focus:border-primary outline-none"
                  placeholder="Nombre del Artista"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-secondary">Email</label>
                <input 
                  required
                  type="email" 
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                  className="bg-deep-black border border-outline-variant/50 rounded p-2 text-on-surface focus:border-primary outline-none"
                  placeholder="artist@example.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-secondary">Etiqueta de Usuario</label>
                <input 
                  required
                  type="text" 
                  value={newUserData.userTag}
                  onChange={(e) => setNewUserData({...newUserData, userTag: e.target.value})}
                  className="bg-deep-black border border-outline-variant/50 rounded p-2 text-on-surface focus:border-primary outline-none"
                  placeholder="e.g. @artist_tag"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-secondary">Número de WhatsApp</label>
                <input 
                  required
                  type="text" 
                  value={newUserData.whatsapp}
                  onChange={(e) => setNewUserData({...newUserData, whatsapp: e.target.value})}
                  className="bg-deep-black border border-outline-variant/50 rounded p-2 text-on-surface focus:border-primary outline-none"
                  placeholder="+54 9 11 1234 5678"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-secondary">Subscription Estado</label>
                <select 
                  value={newUserData.subscriptionStatus}
                  onChange={(e) => setNewUserData({...newUserData, subscriptionStatus: e.target.value})}
                  className="bg-deep-black border border-outline-variant/50 rounded p-2 text-on-surface focus:border-primary outline-none"
                >
                  <option value="trial">Prueba gratis 7 días</option>
                  <option value="monthly">Mensualidad (Pago)</option>
                  <option value="partner">Partner (Sin límite)</option>
                </select>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant/20 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 border border-outline-variant text-secondary hover:text-on-surface rounded transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 px-4 bg-primary text-on-primary hover:bg-primary-fixed rounded transition-colors"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {detailsModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setDetailsModalUser(null)}
              className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Información del Artista</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <img alt="Artista Avatar" className="w-16 h-16 rounded bg-surface object-cover cursor-pointer hover:opacity-80 transition-opacity" onClick={() => { setDetailsModalUser(null); navigate(`/${detailsModalUser.userTag?.startsWith('@') ? detailsModalUser.userTag : '@' + (detailsModalUser.userTag || detailsModalUser.uid)}`); }} src={detailsModalUser.profilePhotoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBBMNHOgO0BFPGX5cKluHezzRBDPJueLyUUOSVbMZdAJNASP32jgHA4OlyC47sQI2OSfmnfWWJhsXilZEsOSBqjgJZonLj5pT-FxqVdN9wf0qc9xnw47B_mrLf_EJOGsPCFdm0ezBohArgfCnAGkL4nmXJbY4CXUXnPHC5HN5i25dYpUqlmKCy9E-GOy0FViiulx7v565DyOKMgONwgdsmF5EhQ9sYDmp7SshK7ecWSiMfVG7yXfsm_Dm9BxUhg4h5sZ-clTBdjYBLi"}/>
                <div>
                  <div className="text-on-surface font-bold text-lg">{detailsModalUser.displayName || detailsModalUser.email}</div>
                  <div className="text-secondary text-sm">{detailsModalUser.userTag}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-deep-black p-3 rounded border border-outline-variant/20">
                    <div className="text-secondary text-xs uppercase tracking-wider">Plan</div>
                    <div className="text-on-surface capitalize font-bold">{detailsModalUser.subscriptionStatus}</div>
                </div>
                <div className="bg-deep-black p-3 rounded border border-outline-variant/20">
                    <div className="text-secondary text-xs uppercase tracking-wider">Expira</div>
                    <div className="text-on-surface font-bold text-sm">
                        {detailsModalUser.subscriptionStatus === 'partner' ? 'Nunca' : 
                         detailsModalUser.subscriptionEndsAt?.toDate ? (
                             (() => {
                                 const diff = detailsModalUser.subscriptionEndsAt.toDate().getTime() - new Date().getTime();
                                 const days = diff < 0 ? -Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24)) : Math.ceil(diff / (1000 * 60 * 60 * 24));
                                 return (
                                     <div className="flex flex-col">
                                         <span>{detailsModalUser.subscriptionEndsAt.toDate().toLocaleDateString()}</span>
                                         <span className={`text-[10px] w-fit px-1.5 py-0.5 mt-1 rounded font-bold tracking-widest ${days <= 0 ? 'bg-error/20 text-error' : days <= 3 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-primary/20 text-primary'}`}>
                                            {days < 0 ? `Hace ${Math.abs(days)} días` : `Quedan ${days} días`}
                                         </span>
                                     </div>
                                 );
                             })()
                         ) : 'N/A'}
                    </div>
                </div>
                <div className="bg-deep-black p-3 rounded border border-outline-variant/20">
                    <div className="text-secondary text-xs uppercase tracking-wider">Visitas</div>
                    <div className="text-on-surface font-bold">{detailsModalUser.views || 0}</div>
                </div>
                <div className="bg-deep-black p-3 rounded border border-outline-variant/20">
                    <div className="text-secondary text-xs uppercase tracking-wider">Wa. Clicks</div>
                    <div className="text-on-surface font-bold">{detailsModalUser.whatsappClicks || 0}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-outline-variant/20 flex flex-col gap-2">
                {detailsModalUser.subscriptionStatus === 'trial' && (
                    <button 
                      onClick={() => handleUpgradeToMonthly(detailsModalUser.uid, detailsModalUser.subscriptionEndsAt)} 
                      className="w-full py-2 px-4 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">upgrade</span>
                        Pasar a Mensualidad
                    </button>
                )}
                {detailsModalUser.subscriptionStatus === 'monthly' && (
                    <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => handleRenewDays(detailsModalUser.uid, detailsModalUser.subscriptionEndsAt, 30)} 
                          className="flex-1 py-2 px-4 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded transition-colors flex items-center justify-center gap-1 text-sm font-bold"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            30 Días
                        </button>
                        <button 
                          onClick={() => handleRenewDays(detailsModalUser.uid, detailsModalUser.subscriptionEndsAt, -30)} 
                          className="flex-1 py-2 px-4 bg-error/10 text-error border border-error/20 hover:bg-error/20 rounded transition-colors flex items-center justify-center gap-1 text-sm font-bold"
                        >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                            30 Días
                        </button>
                    </div>
                )}
                <button 
                  onClick={() => handleResetPassword(detailsModalUser)}
                  className="w-full py-2 px-4 bg-error/10 text-error border border-error/20 hover:bg-error/20 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                  Resetear Contraseña a 123456
                </button>
                {detailsModalUser.whatsapp && (
                    <a 
                      href={`https://wa.me/${detailsModalUser.whatsapp.replace(/\D/g, '')}`} 
                      target="_blank" rel="noreferrer" 
                      className="w-full py-2 px-4 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/20 rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      Contactar por WhatsApp
                    </a>
                )}

                <button 
                  onClick={() => handleDeleteUser(detailsModalUser.uid)}
                  className="w-full mt-2 py-2 px-4 bg-red-900/40 text-red-400 border border-red-500/30 hover:bg-red-800/50 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                  Eliminar Cuenta
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
