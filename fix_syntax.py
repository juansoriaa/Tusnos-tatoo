import re

with open('src/components/DemoDashboard.tsx', 'r') as f:
    content = f.read()

# Remove the dangling part of handleSaveFaqs
# It starts around data.faqs = faqs; and ends at }; before return (
dangling_regex = r"\s*data\.faqs = faqs;\s*localStorage\.setItem\('demoArtistData_demo', JSON\.stringify\(data\)\);\s*window\.dispatchEvent\(new CustomEvent\('profileDataChanged'\)\);\s*alert\(\"FAQs guardadas exitosamente!\"\);\s*\} catch\(err\) \{\s*console\.error\(err\);\s*\}\s*\};"

content = re.sub(dangling_regex, "", content)

with open('src/components/DemoDashboard.tsx', 'w') as f:
    f.write(content)
