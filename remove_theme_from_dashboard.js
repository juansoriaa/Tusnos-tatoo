import fs from 'fs';
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// 1. Remove state
code = code.replace(/    const \[theme, setTheme\] = useState\('default'\);\n/, '');
code = code.replace(/    const \[themeModalOpen, setThemeModalOpen\] = useState\(false\);\n/, '');

// 2. Remove from initialDataStr block in loadData
code = code.replace(/                setTheme\(data\.theme \|\| 'default'\);\n/, '');
code = code.replace(/                    faqs: data\.faqs \|\| defaultFaqs,\n                    theme: data\.theme \|\| 'default'\n/g, "                    faqs: data.faqs || defaultFaqs\n");
code = code.replace(/                faqs: defaultFaqs,\n                theme: 'default'\n/g, "                faqs: defaultFaqs\n");

code = code.replace(/            setTheme\(initData\.theme\);\n/, '');

// 3. Remove from currentData
code = code.replace(/        faqs,\n        theme\n    \};\n/g, "        faqs\n    };\n");

// 4. Remove from demoData payload
code = code.replace(/            faqs: faqs,\ntheme: theme\n/g, "            faqs: faqs\n");
code = code.replace(/            faqs: faqs,\n            theme\n/g, "            faqs: faqs\n");
code = code.replace(/            faqs,\n            theme\n/g, "            faqs\n");

fs.writeFileSync('src/components/DemoDashboard.tsx', code);
