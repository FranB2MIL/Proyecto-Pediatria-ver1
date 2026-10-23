import styles from './PatientTopBar.module.css'

// Header de las pantallas del paciente (no usa la navbar del doctor)
const PatientTopBar = ({ firstName }) => {
  return (
    <header className={styles.topBar}>
      <span className={styles.brand}>MediTrack</span>
      {firstName && <span className={styles.greeting}>Hola, {firstName}</span>}
    </header>
  )
}

export default PatientTopBar
