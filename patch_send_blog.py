import re

with open('src/components/SuperAdmin.tsx', 'r') as f:
    content = f.read()

# Make sure addDoc is imported if needed, actually we can use addDoc, collection
if "addDoc" not in content:
    content = content.replace("getDoc, deleteDoc } from 'firebase/firestore';", "getDoc, deleteDoc, addDoc } from 'firebase/firestore';")

old_func = r"  const handleSendBlog = \(e: any\) => \{\n    e\.preventDefault\(\);\n    if \(!blogTitle \|\| !blogBody\) return;\n    const targetDesc = blogTarget === 'specific' \? `Usuario: \$\{blogSpecificUser\}` : \(blogTarget === 'all' \? 'Todos' : blogTarget\);\n    alert\(`Notificación \"\$\{blogTitle\}\" enviada a \$\{targetDesc\} \(Simulado\)`\);\n    setBlogHistory\(\[\{ id: Date.now\(\), title: blogTitle, body: blogBody, target: targetDesc, date: new Date\(\) \}, \.\.\.blogHistory\]\);\n    setBlogTitle\(''\);\n    setBlogBody\(''\);\n    setBlogSpecificUser\(''\);\n  \};"

new_func = """  const handleSendBlog = async (e: any) => {
    e.preventDefault();
    if (!blogTitle || !blogBody) return;
    
    try {
      let targetUsers = [];
      if (blogTarget === 'all') {
        targetUsers = users;
      } else if (blogTarget === 'monthly' || blogTarget === 'trial') {
        targetUsers = users.filter(u => u.subscriptionStatus === blogTarget);
      } else if (blogTarget === 'specific') {
        const lowerSearch = blogSpecificUser.toLowerCase();
        targetUsers = users.filter(u => 
          (u.displayName && u.displayName.toLowerCase().includes(lowerSearch)) || 
          (u.userTag && u.userTag.toLowerCase().includes(lowerSearch)) ||
          (u.email && u.email.toLowerCase().includes(lowerSearch))
        );
      }

      if (targetUsers.length === 0) {
        alert('No se encontraron usuarios para este filtro.');
        return;
      }

      // Send to each user's notifications subcollection
      for (const u of targetUsers) {
        await addDoc(collection(db, 'users', u.uid, 'notifications'), {
          title: blogTitle,
          body: blogBody,
          date: serverTimestamp(),
          read: false
        });
      }

      const targetDesc = blogTarget === 'specific' ? `Usuario: ${blogSpecificUser}` : (blogTarget === 'all' ? 'Todos' : blogTarget);
      alert(`Notificación "${blogTitle}" enviada a ${targetUsers.length} usuario(s).`);
      
      setBlogHistory([{ id: Date.now(), title: blogTitle, body: blogBody, target: targetDesc, date: new Date() }, ...blogHistory]);
      setBlogTitle('');
      setBlogBody('');
      setBlogSpecificUser('');
    } catch (err) {
      console.error(err);
      alert('Error enviando notificación');
    }
  };"""

content = re.sub(old_func, new_func, content)

with open('src/components/SuperAdmin.tsx', 'w') as f:
    f.write(content)

