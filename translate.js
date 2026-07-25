const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

const replacements = {
  'Overview': 'Resumen',
  'Total Artists': 'Artistas Totales',
  'Active Network': 'Red Activa',
  'Active Renewals': 'Renovaciones Activas',
  'Paid Subscriptions': 'Suscripciones Pagadas',
  'Trial Users': 'Usuarios en Prueba',
  'Pending Conversion': 'Conversión Pendiente',
  'Performance Oversight': 'Supervisión de Rendimiento',
  'Renewal Management': 'Gestión de Renovaciones',
  'Action required for approaching billing cycles.': 'Acción requerida para ciclos de facturación próximos.',
  'Artist': 'Artista',
  'Plan Tier': 'Plan',
  'Status': 'Estado',
  'Time Left': 'Tiempo Restante',
  'Top Performers List': 'Lista de Mejores Artistas',
  'Top Artists': 'Mejores Artistas',
  'Revenue & Settings': 'Ingresos y Configuración',
  'Revenue Streams': 'Flujos de Ingresos',
  'Subscription vs Commission': 'Suscripción vs Comisión',
  'MAY': 'MAY',
  'JUN': 'JUN',
  'JUL': 'JUL',
  'AUG': 'AGO',
  'SEP': 'SEP',
  'OCT': 'OCT',
  'Fee Configuration Form': 'Formulario de Configuración de Tarifas',
  'Global Config': 'Configuración Global',
  'Platform Base Fee (%)': 'Tarifa Base de la Plataforma (%)',
  'Pro Tier Subscription': 'Suscripción Pro',
  'Save Config': 'Guardar Configuración',
  'Create New Artist': 'Crear Nuevo Artista',
  'Quick Add': 'Añadir Rápido',
  'User Tag': 'Etiqueta de Usuario',
  'WhatsApp Number': 'Número de WhatsApp',
  'Subscription Status': 'Estado de Suscripción',
  'Cancel': 'Cancelar',
  'Create': 'Crear',
};

for (const [en, es] of Object.entries(replacements)) {
  content = content.replace(new RegExp(en, 'g'), es);
}

fs.writeFileSync('src/components/SuperAdmin.tsx', content);
