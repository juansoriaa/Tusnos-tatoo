with open('src/components/SuperAdmin.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "    }\n  const handleDeleteUser",
    "    }\n  };\n\n  const handleDeleteUser"
)

with open('src/components/SuperAdmin.tsx', 'w') as f:
    f.write(content)
