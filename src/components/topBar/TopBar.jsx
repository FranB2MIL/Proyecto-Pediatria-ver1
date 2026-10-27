import UserMenu from '../userMenu/UserMenu'
import styles from './TopBar.module.css'

// Header simple (marca + saludo + Salir) para las pantallas sin navegación: paciente y admin
const TopBar = ({ name, logoutPath }) => {
  return (
    <header className={styles.topBar}>
      <span className={styles.brand}>MediTrack</span>
      <UserMenu name={name} logoutPath={logoutPath} />
    </header>
  )
}

export default TopBar
