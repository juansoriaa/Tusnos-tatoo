import re

with open('src/components/SuperAdmin.tsx', 'r') as f:
    content = f.read()

# Remove the handleSeedFakeUsers function entirely.
seed_regex = r"const handleSeedFakeUsers = async \(\) => \{[\s\S]*?\s*setUsers\(\[...users, ...createdUsers\]\);\s*alert\('Usuarios de prueba agregados exitosamente'\);\s*\} catch\(err\) \{\s*console\.error\(err\);\s*alert\('Error creating fake users'\);\s*\}\s*\};"
content = re.sub(seed_regex, "", content)

# Remove the button that calls it
btn_regex = r"<button onClick=\{handleSeedFakeUsers\}[\s\S]*?Demo\s*</button>"
content = re.sub(btn_regex, "", content)

# Add handleDeleteUser function
handle_delete = """
  const handleDeleteUser = async (userId: string) => {
    const isConfirmed = window.confirm("¿Estás seguro que deseas eliminar esta cuenta y toda su colección? Esta acción no se puede deshacer.");
    if (!isConfirmed) return;

    try {
      // Import deleteDoc if not imported
      await deleteDoc(doc(db, 'users', userId));
      // Delete other related subcollections if needed. For now, deleting the user document.
      setUsers(users.filter(u => u.uid !== userId));
      setDetailsModalUser(null);
      alert('Cuenta eliminada exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error eliminando la cuenta');
    }
  };
"""

# Place it after handleRenewDays
renew_regex = r"const handleRenewDays = async \(userId: string, currentEndsAt: any, days: number\) => \{[\s\S]*?alert\('Error updating user'\);\s*\}"
content = re.sub(renew_regex, lambda m: m.group(0) + handle_delete, content)

# Add import for deleteDoc if missing
if "deleteDoc" not in content:
    content = content.replace("getDoc } from 'firebase/firestore';", "getDoc, deleteDoc } from 'firebase/firestore';")

# Add the Delete button to the Details Modal
del_btn = """
                <button 
                  onClick={() => handleDeleteUser(detailsModalUser.uid)}
                  className="w-full mt-2 py-2 px-4 bg-red-900/40 text-red-400 border border-red-500/30 hover:bg-red-800/50 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">delete_forever</span>
                  Eliminar Cuenta
                </button>
"""

# Place it right after Contactar por WhatsApp
whatsapp_regex = r"\{detailsModalUser\.whatsapp && \([\s\S]*?Contactar por WhatsApp\s*</a>\s*\)\}"
content = re.sub(whatsapp_regex, lambda m: m.group(0) + "\n" + del_btn, content)

with open('src/components/SuperAdmin.tsx', 'w') as f:
    f.write(content)

