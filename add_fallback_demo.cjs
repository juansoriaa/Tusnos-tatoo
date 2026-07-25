const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const fallbackStr = `
                const fallback = [
    {
      id: "fallback_1",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ",
      alt: "A highly detailed black and grey realism tattoo of a lion's face on a human forearm.",
      title: "Detailed black & grey realism",
      tags: ["Realismo", "Blackwork"],
      hours: 12,
      sessions: 2,
      size: "20x15 cm"
    },
    {
      id: "fallback_2",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5DDAAcFYiq49hBeVBI21d-Kfzr6qKoiRfIXKP1UnRW7YF5GJFA5MFkoXHtdBxy6uEbgH9z0zVWPWxKIEtX3oXemICFI1Ssr7FZ-Hh_OVDjHQ-QLRxMXBp5c4FwHXswrbPE9ZdzVelcUFL0h0nTLuzuWpLR_QRaZBZsyq7srBJaHktN6PcAYY-NQ2d-8FRg_RJ15MYhPUfdaEk_oGzE57hWrd7ZFkT4ldOW1tTIz0PqCqzo5_ALKPhXP1byoz8eiIEM30X9HQLzho",
      alt: "Close-up of a delicate minimalist tattoo of a single rose.",
      title: "Delicate minimalist single rose",
      tags: ["Minimalista"],
      hours: 3,
      sessions: 1,
      size: "8x5 cm"
    },
    {
      id: "fallback_3",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA",
      alt: "Large-scale blackwork tattoo covering a full back.",
      title: "Large-scale blackwork back piece",
      tags: ["Blackwork", "Tradicional"],
      hours: 24,
      sessions: 4,
      size: "Espalda completa"
    },
    {
      id: "fallback_4",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYd_bLleuw4yQOy32XLTc-ZA36ZI1Tx20UNajjWgcV5DQKPXzxE6vuXBvD3Ov7hcyCDB0Wpbc1BK7v4CJMIFC3KWS1bBdxzGJUcjSraTSohPMSOjESD5If5O8I8ZxmV0rWCZ_T_ncpPVYMBz9OD9_NXcCjwNkftJNjmowLcbK_jq3Fy-FieRJHky4A0G8SWmDSNGfDrlvoUxmb8aYt9Dxvi2w5uLOR4ir0BxgO2Sh5IfSstId4FI96uowW3Y1Jw1YCCRUk82ep4yPk",
      alt: "Hyper-realistic black and grey realism tattoo",
      title: "Hyper-realistic black & grey",
      tags: ["Realismo", "Blackwork"],
      hours: 15,
      sessions: 3,
      size: "Media manga"
    },
    {
      id: "fallback_5",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5LMtrwwTSFu95uiU0bVfXq9VmWZIJ10dyJ3Lwbu6VmGCGEnBfZXi0WQlrXz0JAAAXzBurYTXa8IleL_Z1UTW7x4BHigWcVZCarsYy-PDu3G5JOwCsz3c0mgBTVI90e2b4bcw5lLDYzc5mU0qXptlWkjo0e3ynOS0xxfhCjxtvA0Bykbfo3wSX79T_fwcMg4uFHYXGxws2NYoOaKhhgr6J8ErFHQqB5QJSnK9c2zkwmEgiIM-74wbPKlVjQPO8pxETkDa8jrj1OmA",
      alt: "Detailed blackwork owl",
      title: "Detailed blackwork owl",
      tags: ["Blackwork", "Realismo"],
      hours: 8,
      sessions: 2,
      size: "15x15 cm"
    },
    {
      id: "fallback_6",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiCcgze-zMmmFAOjCN4xQ6CeoqLv_BgkKj7iZWfDqCXh_QoGPCTeSVYBVbA3H_kloM0bS3tXxBa3cY1pNmeNr4CtKPuWY_AFMUCkSb29fVkPS2cJxnOnCZXdCOsST5XxUvicao5fv4hZLXgol8izTusYUx7vRcLz4wQi2YO2jqeWtkjahkSIkJ9bsZTT9Yc4B7Xyxsbuht5vClIiVLFRgAVTnmtfvKmMPDtXdGMokCs42r9vRajXl7r_QmrmtosOLgBWwvZeva_eLj",
      alt: "Minimalist mountain",
      title: "Minimalist mountain",
      tags: ["Minimalista"],
      hours: 2,
      sessions: 1,
      size: "5x5 cm"
    },
    {
      id: "fallback_7",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4kAzmGiitSjdk2D4_OGK9WYclBZmk7cefWe8BPMcY8LBacqpcoUc38Awd5FqNh4Eba1D7004xOI8zM_OfSwqcVZtS51XTNjE110SdiB0YMIgxjjBiNGxIGDifU-2yV2DRHxJyft8AS6K6D8tdWl2VVOQfu7wbFLEt11twfKV6pV5KYEwWElAna9GN2J36mCgbidD9hs4hjuPVR45M0Pps7tijbmPhi-RljtyBBrI8SYhiXDvFxXBFVQP1eN6iXqLAzNKsTq_SVt3I",
      alt: "Realistic koi fish",
      title: "Realistic koi fish",
      tags: ["Realismo", "Tradicional"],
      hours: 10,
      sessions: 2,
      size: "20x20 cm"
    },
    {
      id: "fallback_8",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeiQ96QvK_CB1f544ltSr7zUBzrf2JkPLOlygIBhVzlG8_X5vs1kq9-qAOcPYyPpmhMJ1zn9Tcmc7NtA_i3PYk36Iz_1F__r0TDyBqJSggpzoN5zrF7-cvpX9b6WXiYVcfeoqEuaJYzdSoe8kUbhd0B4xu4PGqI41o9CycgDPQVit7QtUNuxbu8VjI8LNqibJ2Qpoa09qjNLV4Jo2vA81r1KdlIAW9YBEaay9duZ3ZH7HaFAD81admkcERAH-uJz-36mHQSAIx-9Eb",
      alt: "Micro-realism pocket watch",
      title: "Micro-realism pocket watch",
      tags: ["Realismo", "Minimalista"],
      hours: 4,
      sessions: 1,
      size: "8x8 cm"
    },
    {
      id: "fallback_9",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBq1VnZZF7nLUADCQTiQU7dFsZs6g49GFftf-8vLI5Eht2qRTRatf1CSOeX5KEYDypiRNGBkOf_c2xFWSl0jIvxnDMDACEPe9flYK5v_8YXNAZsg1vf9sU4ErKlOyti57hRTbY2bE0gaC06B9DTveMjFNKECVQukrTC9VKQib6kXWcVETRdRFmdCUJdFtzLRk4Dnc1UmNwEx2kNBrXTze-GZPlY4FY-H1oaaAh6UzJLZKz8EHc8jTj761A7z6b_CVlSjqiWdBYTjuCS",
      alt: "Large-scale abstract geometric",
      title: "Large-scale abstract geometric",
      tags: ["Blackwork", "Minimalista"],
      hours: 6,
      sessions: 1,
      size: "10x20 cm"
    },
    {
      id: "fallback_10",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhMj-R1FS_ht2tgrQqme6b2-Hg846oZVQyQ8p1Rchy_7azS2BnqJ5ysLJC8ekDsqqJ8r8LVqJy7K0vGLwO3JKB2uZz_KP8CkOCEmoJ8VMPaUL6cRZryKuQ6HnyRnPdwZ1Qjl2e9IwAs2V3gj-qNn3VIs25WmVqhxfKa7qTsFCOZujgAJV7F3Sot0QO3TJ23bSoB7cpiXHeyHfC00e9Z2qW6y_9DnVNd3R4U30ZGgtAdmqv9-xhzzVl6qAEs0focdc8_W14OXWEfcFu",
      alt: "Small elegant script",
      title: "Small elegant script",
      tags: ["Minimalista"],
      hours: 1,
      sessions: 1,
      size: "3x10 cm"
    },
    {
      id: "fallback_11",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeHO5mvih_r7YM-AQGfl6iWFA1d3CbUokk5zQ4HXbH3KTIJGeDLkdA-9tQrC1005dLiu4B2NyIL87-Y2DeE-B2IaiAIAPscoi7yJyYW7p5C1BPnRQPAcrbpxuDExdI3Xp8j__iKVjs1sqqpCXXVAVzm8PpbbFoPB7ca91f2keDdXcwyQz10d28H_44u4UwZFaPaQzuS6lKDiS77IZ05qxOyMiiwJd0D48vNuQQqLxWFA4X67UB_J03NSR6pFTMBXwwJWUIXU-RHbwf",
      alt: "Forest landscape inside diamond",
      title: "Forest landscape",
      tags: ["Blackwork", "Minimalista"],
      hours: 5,
      sessions: 1,
      size: "12x12 cm"
    },
    {
      id: "fallback_12",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_jhISTzGUC2siSj7XIqc-tB7Bzph9Pa50g881aLp9acURUaH40UfWqwlaPN8vl_o5GGNJwNHZFFRzpVpoVffXojuHdynlpn4l8usek3UlfDg4f2TZsxxNPWV8Iqm6jgpbW3-TnVjiwYzCzrj_Htjt1I3iffZTFCM68lixk6Oz4Jml38mAv0HpdJWGJaSe1Y8Img_4dzl_iPZkU9_WaeA0xH6i2x-1XthcwczFtCWa1ScOMF05bFoWQ7OSotfbDwUlQeZrcGO8bjT7",
      alt: "Neo-traditional dagger",
      title: "Neo-traditional dagger",
      tags: ["Tradicional"],
      hours: 7,
      sessions: 2,
      size: "15x10 cm"
    }
  ];
`;

content = content.replace(
  'const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));\n                setExistingPhotos(photos);',
  `const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));${fallbackStr}\n                setExistingPhotos([...photos, ...fallback]);`
);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
