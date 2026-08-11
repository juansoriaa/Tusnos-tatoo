import fs from 'fs';

let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

// Insert getNavUrl function inside the component if not exists
if (!code.includes('const getNavUrl')) {
    code = code.replace(
        /const handleNav = \(path: string\) => \{/,
        `const getNavUrl = (path: string) => {
        if (path === '/') return '/';
        if (path.startsWith('/demo/') && path !== '/@victor_ink' && path !== '/demo/preload' && currentUserTag) {
            const utag = String(currentUserTag).startsWith('@') ? currentUserTag : '@' + currentUserTag;
            return path.replace('/demo/', '/' + utag + '/');
        }
        return path;
    };
    
    const handleNav = (path: string) => {`
    );
}

// Replace href="#" with href={getNavUrl('path')}
code = code.replace(/href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); handleNav\('\/demo\/dashboard'\); \}\}/g, "href={getNavUrl('/demo/dashboard')} onClick={(e) => { e.preventDefault(); handleNav('/demo/dashboard'); }}");
code = code.replace(/href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); handleNav\('\/demo\/portfolio'\); \}\}/g, "href={getNavUrl('/demo/portfolio')} onClick={(e) => { e.preventDefault(); handleNav('/demo/portfolio'); }}");
code = code.replace(/href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); handleNav\('\/demo\/waitlist'\); \}\}/g, "href={getNavUrl('/demo/waitlist')} onClick={(e) => { e.preventDefault(); handleNav('/demo/waitlist'); }}");
code = code.replace(/href="#" onClick=\{\(e\) => \{ e\.preventDefault\(\); handleNav\('\/demo\/metrics'\); \}\}/g, "href={getNavUrl('/demo/metrics')} onClick={(e) => { e.preventDefault(); handleNav('/demo/metrics'); }}");

fs.writeFileSync('src/components/DemoLayout.tsx', code);
