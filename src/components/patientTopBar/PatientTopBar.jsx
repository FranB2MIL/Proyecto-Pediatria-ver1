import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './PatientTopBar.module.css'

// Header de las pantallas del paciente (no usa la navbar del doctor)
const PatientTopBar = ({ firstName }) => {
  const navigate = useNavigate()
  const { handleUserLogout } = useAuth()

  const handleLogout = () => {
    handleUserLogout()
    navigate('/login')
  }

  return (
    <header className={styles.topBar}>
      <span className={styles.brand}>MediTrack</span>
      <div className={styles.right}>
        {firstName && <span className={styles.greeting}>Hola, {firstName}</span>}
        <button type="button" className={styles.logoutButton} onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  )
}

export default PatientTopBar
