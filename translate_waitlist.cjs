const fs = require('fs');
let content = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

content = content.replace('Manage your appointments, messages, and tattoo sessions effectively.', 'Gestiona tus citas, mensajes y sesiones de tatuaje eficazmente.');
content = content.replace('<label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Time</label>', '<label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Periodo</label>');
content = content.replace('<option>All Time</option>', '<option>Todo el historial</option>');
content = content.replace('<option>This Week</option>', '<option>Esta semana</option>');
content = content.replace('<option>This Month</option>', '<option>Este mes</option>');
content = content.replace('<label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Status</label>', '<label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Estado</label>');
content = content.replace('<option>All Requests</option>', '<option>Todas las solicitudes</option>');
content = content.replace('<option>New</option>', '<option>Nuevas</option>');
content = content.replace('<option>Scheduled</option>', '<option>Programadas</option>');

content = content.replace("time: '2 hours ago'", "time: 'Hace 2 horas'");
content = content.replace("title: 'Cover-up Consultation'", "title: 'Consulta de Cover-up'");
content = content.replace("text: 'I have an old tattoo on my forearm that I want covered up with something botanical. Specifically looking at peonies and ferns in blackwork. Is that possible? I have reference images.'", "text: 'Tengo un tatuaje antiguo en mi antebrazo que quiero cubrir con algo botánico. Específicamente buscando peonías y helechos en blackwork. ¿Es posible? Tengo imágenes de referencia.'");
content = content.replace("type: 'New Request'", "type: 'Nueva solicitud'");
content = content.replace(">New Request<", ">Nueva solicitud<");
content = content.replace(">Cover-up Consultation<", ">Consulta de Cover-up<");
content = content.replace(">I have an old tattoo on my forearm that I want covered up with something botanical...<", ">Tengo un tatuaje antiguo en mi antebrazo que quiero cubrir con algo botánico...<");
content = content.replace(">2 hours ago<", ">Hace 2 horas<");

content = content.replace("time: 'Yesterday'", "time: 'Ayer'");
content = content.replace("title: 'Schedule confirmation for Friday'", "title: 'Confirmación de turno para el viernes'");
content = content.replace("text: 'Just confirming our appointment for Friday at 2PM for the traditional piece. Do I need to do anything specific to prepare?'", "text: 'Solo para confirmar nuestra cita para el viernes a las 2PM para la pieza tradicional. ¿Necesito hacer algo específico para prepararme?'");
content = content.replace("type: 'Scheduled'", "type: 'Programado'");
content = content.replace(">Yesterday<", ">Ayer<");
content = content.replace(">Scheduled<", ">Programado<");
content = content.replace(">Schedule confirmation for Friday<", ">Confirmación de turno para el viernes<");
content = content.replace(">Just confirming our appointment for Friday at 2PM for the traditional piece...<", ">Solo para confirmar nuestra cita para el viernes a las 2PM para la pieza tradicional...<");

content = content.replace("Reply via WhatsApp", "Responder por WhatsApp");
content = content.replace("Portfolio Reference Piece", "Pieza de referencia del portafolio");

fs.writeFileSync('src/components/DemoWaitlist.tsx', content);
