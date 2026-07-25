const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `  const [activeCategory, setActiveCategory] = useState("All");
  const [allTattoos, setAllTattoos] = useState<any[]>([]);`;
  
const replacement = `  const [activeCategory, setActiveCategory] = useState("All");
  const [allTattoos, setAllTattoos] = useState<any[]>([]);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
