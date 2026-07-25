import re

with open('src/components/Landing.tsx', 'r') as f:
    content = f.read()

import_regex = r"import \{ auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged \} from '\.\./firebase';"
import_replacement = """import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';"""

content = re.sub(import_regex, import_replacement, content)

with open('src/components/Landing.tsx', 'w') as f:
    f.write(content)

