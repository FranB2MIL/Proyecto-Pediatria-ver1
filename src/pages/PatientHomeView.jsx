import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientTopBar from '../components/patientTopBar/PatientTopBar'
import PatientProfile from '../components/patientProfile/PatientProfile'
import LatestConsultation from '../components/latestConsultation/LatestConsultation'
import UpcomingAppointments from '../components/upcomingAppointments/UpcomingAppointments'
import HistoryList from '../components/historyList/HistoryList'
import { getMyProfile, getMyConsultations, getMyAppointments } from '../services/patientPortalService'
import { toDateKey } from '../utils/dateUtils'
import styles from './PatientHomeView.module.css'

// Pantalla del paciente logueado: su ficha, sus turnos y su historial, solo lectura
function PatientHomeView() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const [profile, consultations, appointments] = await Promise.all([
          getMyProfile(),
          getMyConsultations(),
          getMyAppointments(),
        ])
        if (!ignore) setData({ profile, consultations, appointments })
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [])

  // Más reciente primero, igual que en la vista del doctor
  const consultations = useMemo(
    () => (data?.consultations ?? [])
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [data],
  )

  // Las fechas son strings yyyy-MM-dd, así que se pueden comparar directo
  const upcomingAppointments = useMemo(() => {
    const todayKey = toDateKey(new Date())
    return (data?.appointments ?? [])
      .filter(a => a.date >= todayKey)
      .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))
  }, [data])

  return (
    <div className={styles.page}>
      <PatientTopBar firstName={data?.profile?.firstName} />

      <main className={styles.content}>
        {loading && <p className={styles.stateMessage}>Cargando tu ficha...</p>}
        {!loading && error && (
          <p className={styles.errorMessage} role="alert">No pudimos cargar tu ficha: {error}</p>
        )}
        {!loading && !error && data && (
          <>
            <PatientProfile {...data.profile} />
            <div className={styles.columns}>
              <div className={styles.mainColumn}>
                <LatestConsultation consultation={consultations[0]} loading={false} error={null} />
                <HistoryList consultations={consultations} loading={false} error={null} />
              </div>
              <aside className={styles.sideColumn}>
                <UpcomingAppointments
                  appointments={upcomingAppointments}
                  loading={false}
                  error={null}
                  onAddAppointment={() => navigate('/mi-ficha/turnos')}
                />
              </aside>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default PatientHomeView
