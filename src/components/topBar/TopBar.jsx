import { Link } from 'react-router-dom'
import UserMenu from '../userMenu/UserMenu'
import styles from './TopBar.module.css'

// Header simple (marca + saludo + Salir) para doctor, paciente y admin.
// homePath (opcional): la marca pasa a ser un link a esa ruta.
// fullWidth (opcional): mismo padding lateral que las vistas a todo el ancho, sin el contenedor de 1760px.
// backTo (opcional, { to, label }): en lugar de la marca, un botón para volver a esa ruta
const TopBar = ({ name, logoutPath, homePath, fullWidth = false, backTo }) => {
  let start
  if (backTo) {
    start = (
      <Link to={backTo.to} className={styles.backButton}>
        <span aria-hidden="true">←</span> {backTo.label}
      </Link>
    )
  } else if (homePath) {
    start = <Link to={homePath} className={styles.brand} aria-label="MediTrack, ir al inicio">MediTrack</Link>
  } else {
    start = <span className={styles.brand}>MediTrack</span>
  }

  return (
    <header className={`${styles.topBar} ${fullWidth ? styles.fullWidth : ''}`}>
      {start}
      <UserMenu name={name} logoutPath={logoutPath} />
    </header>
  )
}

export default TopBar
