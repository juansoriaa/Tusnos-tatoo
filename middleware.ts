export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - static assets with extensions (.js, .css, .png, .svg, .json, etc.)
     */
    '/((?!api|assets|media|_next|.*\\..*).*)',
  ],
};

const BOT_USER_AGENTS = [
  'whatsapp',
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'telegrambot',
  'linkedinbot',
  'discordbot',
  'slackbot',
  'applebot',
  'bingbot',
  'googlebot',
  'meta-externalagent',
];

export default function middleware(request: Request) {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const isBot = BOT_USER_AGENTS.some((bot) => userAgent.includes(bot));

  if (!isBot) {
    // Pass through to React SPA
    return;
  }

  const url = new URL(request.url);
  const pathname = url.pathname;
  const cleanPath = pathname.replace(/^\//, '');

  if (
    cleanPath.startsWith('@') ||
    cleanPath.startsWith('artist/') ||
    (cleanPath.length > 1 &&
      !cleanPath.startsWith('demo') &&
      !cleanPath.startsWith('superadmin'))
  ) {
    const metaUrl = new URL('/api/meta', request.url);
    metaUrl.searchParams.set('path', pathname);
    const obra = url.searchParams.get('obra');
    if (obra) {
      metaUrl.searchParams.set('obra', obra);
    }
    return (Response as any).rewrite(metaUrl);
  }
}
