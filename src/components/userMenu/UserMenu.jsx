import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './UserMenu.module.css'

// Saludo + botón Salir. Lo comparten la navbar del doctor y el header del paciente
const UserMenu = ({ name, logoutPath }) => {
  const navigate = useNavigate()
  const { handleUserLogout } = useAuth()

  const handleLogout = () => {
    handleUserLogout()
    navigate(logoutPath)
  }

  return (
    <div className={styles.userMenu}>
      {name && (
        <>
          <span className={styles.greeting}>Hola, {name}</span>
          <span className={styles.divider} aria-hidden="true" />
        </>
      )}
      <button type="button" className={styles.logoutButton} onClick={handleLogout}>
        Salir
      </button>
    </div>
  )
}

export default UserMenu
