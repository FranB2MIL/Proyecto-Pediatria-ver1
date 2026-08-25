import { useState, useEffect, useMemo } from 'react'
import CalendarToolbar from '../components/calendarToolbar/CalendarToolbar'
import WeekCalendar from '../components/weekCalendar/WeekCalendar'
import { getAvailabilities } from '../services/availabilityService'
import { getAppointmentsByWeek } from '../services/appointmentService'
import { getWeekDays, shiftWeeks } from '../utils/dateUtils'
import { buildWeekSlots } from '../utils/slots'
import AppointmentModal from '../components/appointmentModal/AppointmentModal'
import styles from './AppointmentsView.module.css'

function AppointmentsView() {
  // Fecha "ancla": cualquier día dentro de la semana que estamos mirando.
  const [referenceDate, setReferenceDate] = useState(new Date())

  const [availabilities, setAvailabilities] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const doctorId = 1 // hardcodeado, igual que en PatientList — sale del token cuando haya login

  // useMemo evita recalcular los 7 días en cada render.
  // Sin esto, weekDays sería un array nuevo cada vez y el useEffect se dispararía en loop.
  const weekDays = useMemo(() => getWeekDays(referenceDate), [referenceDate])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        // Promise.all dispara las dos llamadas en paralelo en vez de una tras otra.
        const [availabilityData, appointmentData] = await Promise.all([
          getAvailabilities(),
          getAppointmentsByWeek(weekDays[0], weekDays[6]),
        ])
        setAvailabilities(availabilityData)
        setAppointments(appointmentData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [weekDays, refreshTrigger])

  // Acá se junta todo: días + disponibilidad + turnos => grilla lista para pintar.
  const slotsByDay = useMemo(
    () => buildWeekSlots(weekDays, availabilities, appointments),
    [weekDays, availabilities, appointments]
  )

  const handlePrevWeek = () => setReferenceDate((date) => shiftWeeks(date, -1))
  const handleNextWeek = () => setReferenceDate((date) => shiftWeeks(date, 1))
  const handleToday = () => setReferenceDate(new Date())

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot)
  }

  const handleModalClose = () => {
    setSelectedSlot(null)
  }

  const handleModalSaved = () => {
    setSelectedSlot(null)
    setRefreshTrigger((n) => n + 1)
  }

  const handleConfigureAvailability = () => {
    // TODO(etapa 3): abrir el panel de configuración de disponibilidad.
    console.log('configurar disponibilidad')
  }

  return (
    <div className={styles.pageContainer}>
      <CalendarToolbar
        referenceDate={referenceDate}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
        onConfigureAvailability={handleConfigureAvailability}
      />

      {loading && <p className={styles.message}>Cargando turnos...</p>}
      {error && <p className={styles.message}>Error: {error}</p>}

      {!loading && !error && (
        <WeekCalendar
          weekDays={weekDays}
          slotsByDay={slotsByDay}
          onSlotClick={handleSlotClick}
        />
      )}

      {selectedSlot && (
        <AppointmentModal
          slot={selectedSlot}
          onClose={handleModalClose}
          onSaved={handleModalSaved}
        />
      )}
    </div>
  )
}

export default AppointmentsView
