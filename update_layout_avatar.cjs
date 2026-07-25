const fs = require('fs');
let content = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

const defaultLayoutAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuByR4NUyVVJG5GuLGaRtqWjpCad-ssRG7wJNZiOOJeHykIY9S2eAKXt_nFpI-7F2iK5qdsDhGuFSANZwR96NefHXWFWgkMa2FidlBxVLFU0DO3Khup5Pf9Q_MG-vp8HknfP7FmcKogpQ_BM5vOFw6n1k1mUehIFrxuYqUYBYIOy7jV2RuELrtSHo6ByyE3njg-7BtFcOAWsX8GRbNlrtZ82vz663Cvn1wbr_619qMHrZiTBEOFbX9yhCv1oiB67MwD68MZWnGOjnHo';

const stateToAdd = `    const [avatarUrl, setAvatarUrl] = useState('${defaultLayoutAvatar}');`;

if (!content.includes('const [avatarUrl, setAvatarUrl]')) {
    content = content.replace(/const \[turnosLlenos, setTurnosLlenos\] = useState\(false\);/, stateToAdd + '\n    const [turnosLlenos, setTurnosLlenos] = useState(false);');
}

const parseDataTarget = `if (data.isAvailable === false) {
                    setTurnosLlenos(true);
                }`;
const parseDataReplacement = `if (data.isAvailable === false) {
                    setTurnosLlenos(true);
                }
                if (data.profilePhotoUrl) {
                    setAvatarUrl(data.profilePhotoUrl);
                }`;
content = content.replace(parseDataTarget, parseDataReplacement);

const oldImg = `<img alt="Artist Avatar" className="w-full h-full object-cover" data-alt="A small circular avatar portrait of a tattoo artist. The artist has a serious expression, shot in black and white high contrast lighting, matching a moody, professional editorial aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBmCZVmY3eiiW9cB6XYa10AypcR_W8dTFyi4KGSm_Hc_4HpD05IFN0fCl-9PseWUlhlG2cdk0h-M2zsC8XEMMDDQHQU0R9z5IiuI8oefej1TgGVnlkHG_7_3UuEwBGFTDz8EJncAj7SmrbfbCJ_WtKTqJMGLTN66_vVb6wxwbbHwvbqo7iOl51uMJhWG5PoHnFDCKTwJS7EPhSjfE58u4GTpMzqNWYKAT7JIP4ZtNObA4Sq2HEVl0FYKMqiRjqbtnA5KlYEpQMx70"/>`;
const newImg = `<img alt="Artist Avatar" className="w-full h-full object-cover" src={avatarUrl} />`;
content = content.replace(oldImg, newImg);

fs.writeFileSync('src/components/DemoLayout.tsx', content);

