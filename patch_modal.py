import re

with open('src/components/ArtistProfile.tsx', 'r') as f:
    content = f.read()

content = content.replace('touch-none overscroll-none overflow-hidden', 'overscroll-none')
content = content.replace('cursor-pointer touch-none', 'cursor-pointer')

with open('src/components/ArtistProfile.tsx', 'w') as f:
    f.write(content)

