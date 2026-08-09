import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const additionalPhotos = `    {
      id: "fallback_6",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiWtwSf0Fh3AWm01LAlMfj3JGoOdHldaVkVIRDRpbavMRKQEt_SI7cvqZB7R56dQt7nuInHJM7V0a74racFxJT0E12v57KMBnC09rQOtg5YVpvOdglwy8KnhHl1H0tFedvuBum6LD2ADyKGFqdnQ3lUJqIhOZj6bJPzlLI4S7L2n9tqn9wZ6t8smG60s2wvnHM3NabsjD_rMrUmix943Tdd_CAZDTFaQeq5FEq8IXpsVkSLkJ24K0VpV9R4GRF2SDH8cwWPwwNjXI",
      alt: "Intricate mandala design",
      title: "Mandala Dotwork",
      categories: ["Dotwork", "Minimalista"],
      hours: 5,
      sessions: 1,
      size: "10x10 cm"
    },
    {
      id: "fallback_7",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ",
      alt: "Geometric wolf tattoo",
      title: "Geometric Wolf",
      categories: ["Geométrico", "Blackwork"],
      hours: 6,
      sessions: 1,
      size: "12x15 cm"
    },
    {
      id: "fallback_8",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA",
      alt: "Traditional snake and dagger",
      title: "Snake & Dagger",
      categories: ["Tradicional"],
      hours: 4,
      sessions: 1,
      size: "10x18 cm"
    }
];`;

code = code.replace(/    \}\n\];/g, '    },\n' + additionalPhotos);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
