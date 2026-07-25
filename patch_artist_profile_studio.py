import re

with open('src/components/ArtistProfile.tsx', 'r') as f:
    content = f.read()

target = r"<div className=\"grid md:grid-cols-2 gap-12 items-center\">\n\s*<div>"
replacement = """<div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">"""

content = re.sub(target, replacement, content)

with open('src/components/ArtistProfile.tsx', 'w') as f:
    f.write(content)

