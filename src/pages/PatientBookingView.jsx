import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PatientTopBar from '../components/patientTopBar/PatientTopBar'
import { getMyProfile } from '../services/patientPortalService'
import styles from './PatientBookingView.module.css'

// PLACEHOLDER: todavía no está definido cómo agenda turnos el paciente
// (qué doctor, qué disponibilidad ve, si confirma el doctor, etc.).
// Esta pantalla solo existe para que el botón "+" de Próximos turnos tenga destino.
function PatientBookingView() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Solo para el saludo del header; si falla, la pantalla se muestra igual
  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getMyProfile()
        if (!ignore) setProfile(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [])

  return (
    <div className={styles.page}>
      <PatientTopBar firstName={!loading && !error ? profile?.firstName : null} />

      <main className={styles.content}>
        <Link to="/mi-ficha" className={styles.backLink}>‹ Volver a mi ficha</Link>
        <section className={styles.card}>
          <h1 className={styles.title}>Agendar turno</h1>
          <p className={styles.text}>Pronto vas a poder agendar tu turno desde acá.</p>
        </section>
      </main>
    </div>
  )
}

export default PatientBookingView
