import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PatientTopBar from '../components/patientTopBar/PatientTopBar'
import PatientWeekGrid from '../components/patientWeekGrid/PatientWeekGrid'
import PatientConfirmModal from '../modal/PatientConfirmModal'
import {
  getMyProfile, getMyDoctors, getAvailableSlots, bookAppointment,
} from '../services/patientPortalService'
import { getWeekDays, shiftWeeks, formatWeekRange, formatLongDate, toDateKey } from '../utils/dateUtils'
import { getErrorMessage } from '../utils/errorMessages'
import styles from './PatientBookingView.module.css'

function PatientBookingView() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState(null)

  const [doctors, setDoctors] = useState([])
  const [doctorId, setDoctorId] = useState('')
  const [doctorsLoading, setDoctorsLoading] = useState(true)
  const [doctorsError, setDoctorsError] = useState(null)

  const [weekDate, setWeekDate] = useState(() => new Date())
  const [reloadKey, setReloadKey] = useState(0)
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState(null)

  const [selectedSlot, setSelectedSlot] = useState(null)
  const [booking, setBooking] = useState(false)
  const [bookingError, setBookingError] = useState(null)
  const [notice, setNotice] = useState(null)

  const weekDays = getWeekDays(weekDate)
  const from = toDateKey(weekDays[0])
  const to = toDateKey(weekDays[6])
  // No se navega a semanas totalmente pasadas
  const isCurrentWeek = from <= toDateKey(getWeekDays(new Date())[0])
  const selectedDoctor = doctors.find(d => String(d.id) === String(doctorId))

  // Solo para el saludo del header; si falla, la pantalla se muestra igual
  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setProfileLoading(true)
        setProfileError(null)
        const data = await getMyProfile()
        if (!ignore) setProfile(data)
      } catch (err) {
        if (!ignore) setProfileError(err.message)
      } finally {
        if (!ignore) setProfileLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        setDoctorsLoading(true)
        setDoctorsError(null)
        const data = await getMyDoctors()
        if (ignore) return
        setDoctors(data)
        if (data.length === 1) setDoctorId(String(data[0].id))
      } catch (err) {
        if (ignore) return
        if (err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setDoctorsError(err.status === 403 ? 'Esta vista es solo para pacientes' : `No pudimos cargar tus doctores: ${getErrorMessage(err)}`)
      } finally {
        if (!ignore) setDoctorsLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [navigate])

  useEffect(() => {
    if (!doctorId) return
    let ignore = false

    async function load() {
      try {
        setSlotsLoading(true)
        setSlotsError(null)
        const data = await getAvailableSlots(doctorId, from, to)
        if (!ignore) setSlots(data)
      } catch (err) {
        if (ignore) return
        if (err.status === 401) {
          navigate('/login', { replace: true })
          return
        }
        setSlots([])
        // 400 y 404 traen un mensaje del back pensado para mostrarse
        setSlotsError(err.status === 400 || err.status === 404 ? err.message : getErrorMessage(err))
      } finally {
        if (!ignore) setSlotsLoading(false)
      }
    }

    load()
    return () => { ignore = true }
  }, [doctorId, from, to, reloadKey, navigate])

  const handleDoctorChange = (event) => {
    setDoctorId(event.target.value)
    setSlots([])
    setNotice(null)
  }

  const handleShiftWeek = (amount) => {
    setWeekDate(prev => shiftWeeks(prev, amount))
    setNotice(null)
  }

  const handleCloseModal = () => {
    setSelectedSlot(null)
    setBookingError(null)
  }

  const handleConfirm = async () => {
    setBooking(true)
    setBookingError(null)
    try {
      await bookAppointment({
        doctorId: Number(doctorId),
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
      })
      navigate('/mi-ficha')
    } catch (err) {
      if (err.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      if (err.status === 409) {
        // Otro paciente se lo llevó: se cierra el modal y se muestra la semana actualizada
        handleCloseModal()
        setNotice(err.message)
        setReloadKey(key => key + 1)
      } else {
        setBookingError(err.status === 400 || err.status === 404 ? err.message : getErrorMessage(err))
      }
      setBooking(false)
    }
  }

  return (
    <div className={styles.page}>
      <PatientTopBar firstName={!profileLoading && !profileError ? profile?.firstName : null} />

      <main className={styles.content}>
        <Link to="/mi-ficha" className={styles.backLink}>‹ Volver a mi ficha</Link>
        <section className={styles.card}>
          <h1 className={styles.title}>Agendar turno</h1>

          {doctorsLoading && <p className={styles.text}>Cargando...</p>}
          {!doctorsLoading && doctorsError && <p className={styles.error} role="alert">{doctorsError}</p>}
          {!doctorsLoading && !doctorsError && doctors.length === 0 && (
            <p className={styles.text}>Todavía no tenés un doctor vinculado. Pedile a tu doctor que te vincule.</p>
          )}

          {!doctorsLoading && !doctorsError && doctors.length > 0 && (
            <>
              {doctors.length === 1 ? (
                <p className={styles.text}>Doctor: {doctors[0].firstName} {doctors[0].lastName}</p>
              ) : (
                <label className={styles.field}>
                  <span className={styles.label}>Doctor</span>
                  <select className={styles.select} value={doctorId} onChange={handleDoctorChange}>
                    <option value="">Elegí un doctor</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                    ))}
                  </select>
                </label>
              )}

              {notice && <p className={styles.error} role="alert">{notice}</p>}

              {doctorId && (
                <>
                  <div className={styles.weekNav}>
                    <button
                      type="button"
                      className={styles.navButton}
                      onClick={() => handleShiftWeek(-1)}
                      disabled={isCurrentWeek}
                      aria-label="Semana anterior"
                    >
                      ‹
                    </button>
                    <span className={styles.weekRange}>{formatWeekRange(weekDate)}</span>
                    <button
                      type="button"
                      className={styles.navButton}
                      onClick={() => handleShiftWeek(1)}
                      aria-label="Semana siguiente"
                    >
                      ›
                    </button>
                  </div>

                  {slotsLoading && <p className={styles.text}>Cargando horarios...</p>}
                  {!slotsLoading && slotsError && <p className={styles.error} role="alert">{slotsError}</p>}
                  {!slotsLoading && !slotsError && slots.length === 0 && (
                    <p className={styles.text}>No hay horarios disponibles esta semana</p>
                  )}
                  {!slotsLoading && !slotsError && slots.length > 0 && (
                    <PatientWeekGrid weekDays={weekDays} slots={slots} onSelectSlot={setSelectedSlot} />
                  )}
                </>
              )}
            </>
          )}
        </section>
      </main>

      {selectedSlot && (
        <PatientConfirmModal
          title="Confirmar turno"
          confirmLabel="Confirmar turno"
          submitting={booking}
          error={bookingError}
          onConfirm={handleConfirm}
          onClose={handleCloseModal}
        >
          <p>Doctor: {selectedDoctor?.firstName} {selectedDoctor?.lastName}</p>
          <p>Fecha: {formatLongDate(selectedSlot.date)}</p>
          <p>Hora: {selectedSlot.startTime} h</p>
        </PatientConfirmModal>
      )}
    </div>
  )
}

export default PatientBookingView
