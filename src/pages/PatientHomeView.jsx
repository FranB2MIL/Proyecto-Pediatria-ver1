import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientTopBar from '../components/patientTopBar/PatientTopBar'
import PatientProfile from '../components/patientProfile/PatientProfile'
import LatestConsultation from '../components/latestConsultation/LatestConsultation'
import UpcomingAppointments from '../components/upcomingAppointments/UpcomingAppointments'
import HistoryList from '../components/historyList/HistoryList'
import EditProfileModal from '../modal/EditProfileModal'
import {
  getMyProfile, getMyConsultations, getMyAppointments, updateMyProfile,
} from '../services/patientPortalService'
import { toDateKey } from '../utils/dateUtils'
import styles from './PatientHomeView.module.css'

// Pantalla del paciente logueado: su ficha (editable), sus turnos y su historial
function PatientHomeView() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // Si falla, el error sube al modal, que lo muestra sin cerrarse
  const handleSaveProfile = async (profileData) => {
    const updated = await updateMyProfile(profileData)
    setData(prev => ({ ...prev, profile: updated }))
    setIsEditingProfile(false)
  }

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
        if (!ignore) setError(err.status === 403 ? 'Esta vista es solo para pacientes' : `No pudimos cargar tu ficha: ${err.message}`)
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
  // y la hora "HH:mm" también: un turno de hoy cuya hora ya pasó no es próximo
  const upcomingAppointments = useMemo(() => {
    const now = new Date()
    const nowKey = `${toDateKey(now)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    return (data?.appointments ?? [])
      .filter(a => `${a.date} ${a.startTime}` >= nowKey)
      .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))
  }, [data])

  return (
    <div className={styles.page}>
      <PatientTopBar firstName={data?.profile?.firstName} />

      <main className={styles.content}>
        {loading && <p className={styles.stateMessage}>Cargando tu ficha...</p>}
        {!loading && error && (
          <p className={styles.errorMessage} role="alert">{error}</p>
        )}
        {!loading && !error && data && (
          <>
            <PatientProfile {...data.profile} onEdit={() => setIsEditingProfile(true)} />
            <div className={styles.columns}>
              <div className={styles.mainColumn}>
                <LatestConsultation consultation={consultations[0]} loading={false} error={null} />
                <HistoryList consultations={consultations} loading={false} error={null} showDoctor />
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

      {isEditingProfile && data?.profile && (
        <EditProfileModal
          profile={data.profile}
          onClose={() => setIsEditingProfile(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  )
}

export default PatientHomeView
