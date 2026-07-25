import re

with open('src/components/ArtistProfile.tsx', 'r') as f:
    content = f.read()

# Extract the share button
share_regex = r"(<button\s*className=\"w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white\"\s*aria-label=\"Compartir perfil\"[\s\S]*?<span className=\"material-symbols-outlined\">share</span>\s*</button>)"

share_match = re.search(share_regex, content)
share_btn_code = share_match.group(1)

# Remove the share button from its original place
content = content.replace(share_btn_code, "")

# Find Instagram button
insta_regex = r"(<a className=\"w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white\" href=\"[^\"]*\" aria-label=\"Instagram\">[\s\S]*?</a>)"
insta_match = re.search(insta_regex, content)
insta_btn_code = insta_match.group(1)
new_insta = insta_btn_code.replace('href="#"', 'href={artistData?.instagram || "#"}')
new_insta = "{ (artistData?.instagram || !id || id === 'demo') && (\n              " + new_insta.replace("\n", "\n              ") + "\n            )}"
content = content.replace(insta_btn_code, new_insta)

# Find TikTok button
tiktok_regex = r"(<a className=\"w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white\" href=\"[^\"]*\" aria-label=\"TikTok\">[\s\S]*?</a>)"
tiktok_match = re.search(tiktok_regex, content)
tiktok_btn_code = tiktok_match.group(1)
new_tiktok = tiktok_btn_code.replace('href="#"', 'href={artistData?.tiktok || "#"}')
new_tiktok = "{ (artistData?.tiktok || !id || id === 'demo') && (\n              " + new_tiktok.replace("\n", "\n              ") + "\n            )}"
content = content.replace(tiktok_btn_code, new_tiktok)

# Find Facebook button
fb_regex = r"(<a className=\"w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white\" href=\"[^\"]*\" aria-label=\"Facebook\">[\s\S]*?</a>)"
fb_match = re.search(fb_regex, content)
fb_btn_code = fb_match.group(1)
new_fb = fb_btn_code.replace('href="#"', 'href={artistData?.facebook || "#"}')
new_fb = "{ (artistData?.facebook || !id || id === 'demo') && (\n              " + new_fb.replace("\n", "\n              ") + "\n            )}"
content = content.replace(fb_btn_code, new_fb)

# Add the share button back, after the Facebook button block
# We know new_fb was just injected, so we can replace new_fb with new_fb + '\n              ' + share_btn_code
content = content.replace(new_fb, new_fb + '\n              ' + share_btn_code)

with open('src/components/ArtistProfile.tsx', 'w') as f:
    f.write(content)

