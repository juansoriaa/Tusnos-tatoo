import re

with open('src/components/SuperAdmin.tsx', 'r') as f:
    content = f.read()

# Fix the double closing bracket issue and replace handleResetPassword
old_reset = r"  \};\n\n  const handleResetPassword = \(email: string\) => \{\n    alert\(`Se reseteó la contraseña de \$\{email\} a 123456 \(Simulado\)`\);\n  \};"

new_reset = """
  const handleResetPassword = async (user: any) => {
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        customPassword: '123456'
      });
      alert(`Se reseteó la contraseña de ${user.email} a 123456 exitosamente.`);
    } catch (err) {
      console.error(err);
      alert('Error al resetear contraseña');
    }
  };"""

content = re.sub(old_reset, new_reset, content)

# Update onClick in modal
content = content.replace("onClick={() => handleResetPassword(detailsModalUser.email)}", "onClick={() => handleResetPassword(detailsModalUser)}")

with open('src/components/SuperAdmin.tsx', 'w') as f:
    f.write(content)

