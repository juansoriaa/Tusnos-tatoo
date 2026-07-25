const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

if (!code.includes('const [waitlistCount')) {
  // Add state
  code = code.replace(
    /export default function DemoLayout\(\{[^}]+\} : DemoLayoutProps\) \{/,
    `export default function DemoLayout({ children, activeTab, titlePrefix, titleAccent, description } : DemoLayoutProps) {
    const [waitlistCount, setWaitlistCount] = React.useState(3);

    React.useEffect(() => {
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

// Update the hardcoded 3
code = code.replace(
  /<span className=\{`absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-error text-\[10px\] text-on-error font-bold z-10 \$\{animateHighlight \? 'animate-button-pop' : ''\}`\} style=\{\{backgroundColor: '#ffb4ab', color: '#690005'\}\}>\s*3\s*<\/span>/g,
  `<span className={\`absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-on-error font-bold z-10 \${animateHighlight ? 'animate-button-pop' : ''}\`} style={{backgroundColor: '#ffb4ab', color: '#690005'}}>
                                        {waitlistCount}
                                    </span>`
);

code = code.replace(
  /<span className=\{`absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-error text-\[10px\] text-on-error font-bold z-10 transition-transform duration-500 \$\{animateHighlight \? 'animate-button-pop scale-125' : ''\}`\} style=\{\{backgroundColor: '#ffb4ab', color: '#690005'\}\}>\s*3\s*<\/span>/g,
  `<span className={\`absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-on-error font-bold z-10 transition-transform duration-500 \${animateHighlight ? 'animate-button-pop scale-125' : ''}\`} style={{backgroundColor: '#ffb4ab', color: '#690005'}}>
                                {waitlistCount}
                            </span>`
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
