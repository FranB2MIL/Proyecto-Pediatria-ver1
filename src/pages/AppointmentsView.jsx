import { useState, useEffect, useMemo } from 'react'
import CalendarToolbar from '../components/calendarToolbar/CalendarToolbar'
import WeekCalendar from '../components/weekCalendar/WeekCalendar'
import { getAvailabilities } from '../services/availabilityService'
import { getAppointmentsByWeek } from '../services/appointmentService'
import { getWeekDays, shiftWeeks } from '../utils/dateUtils'
import { buildWeekSlots } from '../utils/slots'
import AppointmentModal from '../components/appointmentModal/AppointmentModal'
import AvailabilityModal from '../components/availabilityModal/AvailabilityModal'
import styles from './AppointmentsView.module.css'

function AppointmentsView() {
  // Anchor date: any day within the week which we are looking at
  const [referenceDate, setReferenceDate] = useState(new Date())

  const [availabilities, setAvailabilities] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const doctorId = 1 // hardcoded, same as PatientList - extracted from token when loged.

  // useMemo avoids re-calculating the days in each render.
  // Without this, weekDays would be a new array each time, and the useEffect would trigger in loop
  const weekDays = useMemo(() => getWeekDays(referenceDate), [referenceDate])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        // Promise.all triggers both calls in paralell instead of one after the other.
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

  // Here is where everything merges: days + availabiliy + appointments => table ready.
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


  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)

  const handleConfigureAvailability = () => {
    setIsAvailabilityModalOpen(true)
  }

  const handleAvailabilitySaved = () => {
    setIsAvailabilityModalOpen(false)
    setRefreshTrigger((n) => n + 1)
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

      {isAvailabilityModalOpen && (
        <AvailabilityModal
          onClose={() => setIsAvailabilityModalOpen(false)}
          onSaved={handleAvailabilitySaved}
          existingAvailabilities={availabilities}
        />
      )}

    </div>
  )
}

export default AppointmentsView
