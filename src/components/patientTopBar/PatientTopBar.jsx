import UserMenu from '../userMenu/UserMenu'
import styles from './PatientTopBar.module.css'

// Header de las pantallas del paciente (no usa la navbar del doctor)
const PatientTopBar = ({ firstName }) => {
  return (
    <header className={styles.topBar}>
      <span className={styles.brand}>MediTrack</span>
      <UserMenu name={firstName} logoutPath="/login" />
    </header>
  )
}

export default PatientTopBar
