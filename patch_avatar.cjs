const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf-8');

content = content.replace(/<img src=\{photo.userAvatar\} alt=\{photo.userTag\} className="w-8 h-8 rounded-full border border-primary\/50 object-cover" \/>/g, 
  '<img src={photo.userAvatar} alt={photo.userTag} className="w-8 h-8 rounded-full border border-primary/50 object-cover" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuByR4NUyVVJG5GuLGaRtqWjpCad-ssRG7wJNZiOOJeHykIY9S2eAKXt_nFpI-7F2iK5qdsDhGuFSANZwR96NefHXWFWgkMa2FidlBxVLFU0DO3Khup5Pf9Q_MG-vp8HknfP7FmcKogpQ_BM5vOFw6n1k1mUehIFrxuYqUYBYIOy7jV2RuELrtSHo6ByyE3njg-7BtFcOAWsX8GRbNlrtZ82vz663Cvn1wbr_619qMHrZiTBEOFbX9yhCv1oiB67MwD68MZWnGOjnHo" }} />');

content = content.replace(/<img src=\{photo.userAvatar\} alt=\{photo.userTag\} className="w-6 h-6 rounded-full border border-primary\/50 object-cover" \/>/g, 
  '<img src={photo.userAvatar} alt={photo.userTag} className="w-6 h-6 rounded-full border border-primary/50 object-cover" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuByR4NUyVVJG5GuLGaRtqWjpCad-ssRG7wJNZiOOJeHykIY9S2eAKXt_nFpI-7F2iK5qdsDhGuFSANZwR96NefHXWFWgkMa2FidlBxVLFU0DO3Khup5Pf9Q_MG-vp8HknfP7FmcKogpQ_BM5vOFw6n1k1mUehIFrxuYqUYBYIOy7jV2RuELrtSHo6ByyE3njg-7BtFcOAWsX8GRbNlrtZ82vz663Cvn1wbr_619qMHrZiTBEOFbX9yhCv1oiB67MwD68MZWnGOjnHo" }} />');

fs.writeFileSync('src/components/Landing.tsx', content);
