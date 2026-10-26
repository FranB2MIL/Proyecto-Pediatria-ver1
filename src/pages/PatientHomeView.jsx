import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientTopBar from '../components/patientTopBar/PatientTopBar'
import PatientProfile from '../components/patientProfile/PatientProfile'
import LatestConsultation from '../components/latestConsultation/LatestConsultation'
import UpcomingAppointments from '../components/upcomingAppointments/UpcomingAppointments'
import HistoryList from '../components/historyList/HistoryList'
import EditProfileModal from '../modal/EditProfileModal'
import PatientConfirmModal from '../modal/PatientConfirmModal'
import {
  getMyProfile, getMyConsultations, getMyAppointments, updateMyProfile, cancelMyAppointment,
} from '../services/patientPortalService'
import { formatLongDate } from '../utils/dateUtils'
import { getErrorMessage } from '../utils/errorMessages'
import { APPOINTMENT_STATUS } from '../constants/appointmentStatus'
import { groupUpcomingAppointments } from '../utils/upcomingAppointments'
import styles from './PatientHomeView.module.css'

// Pantalla del paciente logueado: su ficha (editable), sus turnos y su historial
function PatientHomeView() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState(null)
  const [cancelNotice, setCancelNotice] = useState(null)

  // Si falla, el error sube al modal, que lo muestra sin cerrarse
  const handleSaveProfile = async (profileData) => {
    const updated = await updateMyProfile(profileData)
    setData(prev => ({ ...prev, profile: updated }))
    setIsEditingProfile(false)
  }

  const handleCloseCancel = () => {
    setAppointmentToCancel(null)
    setCancelError(null)
  }

  const handleConfirmCancel = async () => {
    setCancelling(true)
    setCancelError(null)
    try {
      await cancelMyAppointment(appointmentToCancel.id)
      // Éxito: se marca cancelado en el mismo arreglo; la lista de activos y la de cancelados
      // se derivan de ahí, así que el turno cambia de grupo al instante (abajo se refresca igual)
      const cancelledId = appointmentToCancel.id
      setData(prev => ({
        ...prev,
        appointments: prev.appointments.map(a =>
          a.id === cancelledId ? { ...a, status: APPOINTMENT_STATUS.CANCELADO } : a
        ),
      }))
    } catch (err) {
      if (err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      if (err.status !== 409) {
        setCancelError(getErrorMessage(err))
        setCancelling(false)
        return
      }
      // 409: el turno ya pasó o ya estaba cancelado; se avisa y se refresca igual
      setCancelNotice(err.message)
    }
    try {
      const appointments = await getMyAppointments()
      setData(prev => ({ ...prev, appointments }))
    } catch (err) {
      setCancelNotice(`No pudimos actualizar tus turnos: ${getErrorMessage(err)}`)
    }
    setCancelling(false)
    handleCloseCancel()
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
        if (ignore) return
        // Sin sesión válida (apiFetch no redirige si no hay token guardado)
        if (err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setError(err.status === 403 ? 'Esta vista es solo para pacientes' : `No pudimos cargar tu ficha: ${getErrorMessage(err)}`)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [navigate])

  // Más reciente primero, igual que en la vista del doctor
  const consultations = useMemo(
    () => (data?.consultations ?? [])
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [data],
  )

  // Turnos futuros separados en activos y cancelados; se recalcula al refrescar tras cancelar
  const upcomingAppointments = useMemo(
    () => groupUpcomingAppointments(data?.appointments ?? []),
    [data],
  )

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
            {cancelNotice && <p className={styles.errorMessage} role="alert">{cancelNotice}</p>}
            <div className={styles.columns}>
              <div className={styles.mainColumn}>
                <LatestConsultation consultation={consultations[0]} loading={false} error={null} />
                <HistoryList consultations={consultations} loading={false} error={null} showDoctor />
              </div>
              <aside className={styles.sideColumn}>
                <div className={styles.sideInner}>
                  <UpcomingAppointments
                    appointments={upcomingAppointments.active}
                    cancelledAppointments={upcomingAppointments.cancelled}
                    loading={false}
                    error={null}
                    onAddAppointment={() => navigate('/mi-ficha/turnos')}
                    onCancelAppointment={(appointment) => {
                      setCancelNotice(null)
                      setAppointmentToCancel(appointment)
                    }}
                  />
                </div>
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

      {appointmentToCancel && (
        <PatientConfirmModal
          title="Cancelar turno"
          confirmLabel="Cancelar turno"
          cancelLabel="Volver"
          danger
          submitting={cancelling}
          error={cancelError}
          onConfirm={handleConfirmCancel}
          onClose={handleCloseCancel}
        >
          <p>¿Querés cancelar este turno?</p>
          <p>{appointmentToCancel.doctorName}</p>
          <p>{formatLongDate(appointmentToCancel.date)} · {appointmentToCancel.startTime} h</p>
        </PatientConfirmModal>
      )}
    </div>
  )
}

export default PatientHomeView
