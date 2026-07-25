import re

with open('src/components/SuperAdmin.tsx', 'r') as f:
    content = f.read()

import_regex = r"import \{ doc, setDoc, updateDoc, serverTimestamp, collection, getDocs, getDoc \} from 'firebase/firestore';"
import_replacement = """import { doc, setDoc, updateDoc, serverTimestamp, collection, getDocs, getDoc, deleteDoc, addDoc } from 'firebase/firestore';"""

content = re.sub(import_regex, import_replacement, content)

with open('src/components/SuperAdmin.tsx', 'w') as f:
    f.write(content)

