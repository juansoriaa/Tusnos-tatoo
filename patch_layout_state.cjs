const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

if (!code.includes('const [waitlistCount')) {
  // Add state
  code = code.replace(
    /export default function DemoLayout\(\{[^}]+\}: DemoLayoutProps\) \{/,
    `export default function DemoLayout({ children, activeTab, titlePrefix, titleAccent, description }: DemoLayoutProps) {
    const [waitlistCount, setWaitlistCount] = useState(3);

    useEffect(() => {
        const updateCount = () => {
            try {
                const saved = localStorage.getItem('demoWaitlistMessages');
                if (saved) {
                    const messages = JSON.parse(saved);
                    setWaitlistCount(3 + messages.length);
                }
            } catch(e) {}
        };
        updateCount();
        window.addEventListener('newWaitlistMessage', updateCount);
        return () => window.removeEventListener('newWaitlistMessage', updateCount);
    }, []);`
  );
}
fs.writeFileSync('src/components/DemoLayout.tsx', code);
