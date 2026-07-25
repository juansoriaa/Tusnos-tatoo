const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const constants = `
const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuByR4NUyVVJG5GuLGaRtqWjpCad-ssRG7wJNZiOOJeHykIY9S2eAKXt_nFpI-7F2iK5qdsDhGuFSANZwR96NefHXWFWgkMa2FidlBxVLFU0DO3Khup5Pf9Q_MG-vp8HknfP7FmcKogpQ_BM5vOFw6n1k1mUehIFrxuYqUYBYIOy7jV2RuELrtSHo6ByyE3njg-7BtFcOAWsX8GRbNlrtZ82vz663Cvn1wbr_619qMHrZiTBEOFbX9yhCv1oiB67MwD68MZWnGOjnHo';
const defaultBanner = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjcpGXPEz0beDBlZrbWo96kxL8SYcB5zMiiXz1xbrFmwvqYW5GPQex6oox-awu_xzVDV-xVHBOZb7J5FaWinZxyv-p_dVvx7nyqWDm8DE96ZCcZjiGx9i8SoPVlU1tgx7piOQQuHe-KPGo797xTz3-Hah3jLnvIr5MmnaWY0vzOsFmANOtV305mcB8ioZWPXCwwEkhO3pFM2gsdfbO2cw8vwlVJxKBOTpjtD1hKf22NaaGM7lT4hpZ-5-bVKccq_JRci5J0v0uXR0';
`;

content = content.replace('export default function DemoDashboard() {', constants + '\nexport default function DemoDashboard() {');

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
