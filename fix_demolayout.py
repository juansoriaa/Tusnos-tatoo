import re

with open('src/components/DemoLayout.tsx', 'r') as f:
    content = f.read()

# Add onNavigate prop
prop_type_regex = r"interface DemoLayoutProps \{([\s\S]*?)\}"
content = re.sub(prop_type_regex, r"interface DemoLayoutProps {\1\n    onNavigate?: (path: string) => void;\n}", content)

component_regex = r"export default function DemoLayout\(\{ ([\s\S]*?) \}: DemoLayoutProps\) \{"
content = re.sub(component_regex, r"export default function DemoLayout({ \1, onNavigate }: DemoLayoutProps) {", content)

# Replace navigate(...) with handleNav(...)
nav_replacer = r"navigate\('([^']+)'\)"
def nav_sub(match):
    path = match.group(1)
    return f"handleNav('{path}')"

content = content.replace("export default function DemoLayout", """
export default function DemoLayout
""")

# wait, better to just inject a handleNav function
handle_nav_injection = """
    const handleNav = (path: string) => {
        if (onNavigate) {
            onNavigate(path);
        } else {
            navigate(path);
        }
    };
"""

content = re.sub(r"const navigate = useNavigate\(\);\n", "const navigate = useNavigate();\n" + handle_nav_injection, content)

content = re.sub(nav_replacer, nav_sub, content)

with open('src/components/DemoLayout.tsx', 'w') as f:
    f.write(content)

