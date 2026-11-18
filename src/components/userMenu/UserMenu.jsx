import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { HOME_BY_ROLE, PORTAL_LABELS, ROLE_PRIORITY, getPortalRole } from '../../utils/roles'
import styles from './UserMenu.module.css'

// Saludo + cambio de portal (si tiene más de un rol) + botón Salir.
// Lo usa el TopBar (doctor, paciente y admin)
const UserMenu = ({ name }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, handleUserLogout } = useAuth()

  const portals = ROLE_PRIORITY.filter((role) => user?.roles.includes(role))
  const showPortals = portals.length > 1
  const currentPortal = getPortalRole(pathname)

  const handleLogout = () => {
    handleUserLogout()
    navigate('/login')
  }

  return (
    <div className={`${styles.userMenu} ${showPortals ? styles.withPortals : ''}`}>
      {name && (
        <>
          <span className={styles.greeting}>Hola, {name}</span>
          <span className={styles.divider} aria-hidden="true" />
        </>
      )}
      {showPortals && (
        <nav className={styles.portals} aria-label="Cambiar de portal">
          {portals.map((role) => {
            const isCurrent = role === currentPortal
            return (
              <Link
                key={role}
                to={HOME_BY_ROLE[role]}
                className={`${styles.portalLink} ${isCurrent ? styles.portalLinkActive : ''}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {PORTAL_LABELS[role]}
              </Link>
            )
          })}
        </nav>
      )}
      <button type="button" className={styles.logoutButton} onClick={handleLogout}>
        Salir
      </button>
    </div>
  )
}

export default UserMenu
