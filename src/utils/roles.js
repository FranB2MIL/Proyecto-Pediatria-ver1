export const HOME_BY_ROLE = {
  Admin: '/admin',
  Doctor: '/',
  Patient: '/mi-ficha',
}

export const ROLE_PRIORITY = ['Admin', 'Doctor', 'Patient']

export const PORTAL_LABELS = {
  Admin: 'Administración',
  Doctor: 'Portal médico',
  Patient: 'Mi ficha',
}

// Home según el rol de mayor prioridad. Sin roles conocidos vuelve a /login,
// que no exige sesión, para no generar un loop de redirecciones.
export function getDefaultHome(roles = []) {
  const role = ROLE_PRIORITY.find((candidate) => roles.includes(candidate))
  return role ? HOME_BY_ROLE[role] : '/login'
}

// La URL es la fuente de verdad del portal actual
export function getPortalRole(pathname) {
  if (pathname.startsWith('/admin')) return 'Admin'
  if (pathname.startsWith('/mi-ficha')) return 'Patient'
  return 'Doctor'
}
