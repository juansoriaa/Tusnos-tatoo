import re

with open('src/components/SuperAdmin.tsx', 'r') as f:
    content = f.read()

# 1. Add state variable
state_regex = r"const \[blogSpecificUser, setBlogSpecificUser\] = useState\(''\);"
state_replacement = """const [blogSpecificUser, setBlogSpecificUser] = useState('');
  const [reminderTarget, setReminderTarget] = useState('expiring_monthly');"""
content = re.sub(state_regex, state_replacement, content)

# 2. Add handleSendReminder function
func_regex = r"const handleSendBlog = async \(e: any\) => \{"
func_replacement = """const handleSendReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetUsers = [];
    let title = "";
    let body = "";

    if (reminderTarget === 'expiring_monthly') {
        targetUsers = users.filter(u => {
            if (u.subscriptionStatus !== 'monthly') return false;
            let daysLeft = 0;
            if (u.subscriptionEndsAt && u.subscriptionEndsAt.toDate) {
                const diffTime = u.subscriptionEndsAt.toDate().getTime() - new Date().getTime();
                daysLeft = diffTime < 0 ? -Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24)) : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }
            return daysLeft <= 3;
        });
        title = "¡Atención! Tu plan mensual está por expirar";
        body = "Tu plan mensual está a punto de caducar en los próximos días. Para no perder acceso a todas las funcionalidades premium de Ink Architect, por favor renueva tu suscripción a la brevedad.";
    } else if (reminderTarget === 'trial') {
        targetUsers = users.filter(u => u.subscriptionStatus === 'trial');
        title = "¡Mejora tu plan hoy mismo!";
        body = "Estás utilizando la versión de prueba gratis. Para acceder a herramientas avanzadas y subir más obras sin límites, pásate al plan mensual y aprovecha todos los beneficios de Ink Architect.";
    }

    if (targetUsers.length === 0) {
      alert('No se encontraron usuarios para este filtro.');
      return;
    }

    try {
        for (const u of targetUsers) {
          await addDoc(collection(db, 'users', u.uid, 'notifications'), {
            title: title,
            body: body,
            date: serverTimestamp(),
            read: false
          });
        }
        alert(`Recordatorios enviados a ${targetUsers.length} usuario(s).`);
    } catch (err) {
        console.error(err);
        alert('Error enviando recordatorios');
    }
  };

  const handleSendBlog = async (e: any) => {"""
content = re.sub(func_regex, func_replacement, content)

# 3. Add UI section
ui_regex = r"</section>\n\n          </div>\n\n          \{\/\* Zone 3: Ingresos y Configuración \*\/\}"
ui_replacement = """</section>
          <section className="glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col mb-gutter">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-error">notification_important</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Enviar Recordatorios Automáticos</h2>
            </div>
            <form onSubmit={handleSendReminder} className="flex flex-col md:flex-row gap-4 items-end">
               <div className="flex flex-col gap-2 w-full md:w-1/2">
                 <label className="font-label-md text-label-md text-secondary">Seleccionar Grupo de Usuarios</label>
                 <select 
                   value={reminderTarget}
                   onChange={(e) => setReminderTarget(e.target.value)}
                   className="bg-deep-black border border-outline-variant/50 rounded p-2 text-sm text-on-surface focus:border-primary outline-none"
                 >
                   <option value="expiring_monthly">Usuarios Mensuales Próximos a Vencer (3 días o menos)</option>
                   <option value="trial">Usuarios en Prueba Gratis (Invitación a Renovar)</option>
                 </select>
               </div>
               <button type="submit" className="w-full md:w-auto px-6 py-2 bg-error/10 text-error border border-error/20 rounded font-bold uppercase tracking-widest text-sm hover:bg-error/20 transition-colors flex justify-center items-center gap-2 h-[42px]">
                 <span className="material-symbols-outlined text-[18px]">send</span>
                 Enviar Recordatorios
               </button>
            </form>
            <div className="mt-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/10 text-sm text-on-surface-variant flex flex-col gap-2">
               <p><span className="font-bold text-on-surface">Mensaje que se enviará:</span></p>
               {reminderTarget === 'expiring_monthly' ? (
                  <>
                    <p className="font-bold text-error">¡Atención! Tu plan mensual está por expirar</p>
                    <p>Tu plan mensual está a punto de caducar en los próximos días. Para no perder acceso a todas las funcionalidades premium de Ink Architect, por favor renueva tu suscripción a la brevedad.</p>
                  </>
               ) : (
                  <>
                    <p className="font-bold text-primary">¡Mejora tu plan hoy mismo!</p>
                    <p>Estás utilizando la versión de prueba gratis. Para acceder a herramientas avanzadas y subir más obras sin límites, pásate al plan mensual y aprovecha todos los beneficios de Ink Architect.</p>
                  </>
               )}
            </div>
          </section>

          </div>

          {/* Zone 3: Ingresos y Configuración */}"""
content = re.sub(ui_regex, ui_replacement, content)

with open('src/components/SuperAdmin.tsx', 'w') as f:
    f.write(content)

