import styles from './WeekCalendar.module.css'
import AppointmentSlot from '../appointmentSlot/AppointmentSlot'
import { formatDayName, formatDayNumber, toDateKey, isToday, isSlotPast } from '../../utils/dateUtils'
import { APPOINTMENT_STATUS } from '../../constants/appointmentStatus'

const WeekCalendar = ({ weekDays, slotsByDay, onSlotClick, onlyReserved = false }) => {
  const now = new Date()

  return (
    <div className={styles.calendar}>
      {weekDays.map((day) => {
        const key = toDateKey(day)
        const slots = slotsByDay[key] ?? []
        // "Solo reservados": solo los reservados (pasados incluidos).
        // Vista normal: se ocultan los libres cuyo horario ya pasó.
        const visibleSlots = onlyReserved
          ? slots.filter((slot) => slot.status === APPOINTMENT_STATUS.RESERVADO)
          : slots.filter(
              (slot) =>
                slot.status !== APPOINTMENT_STATUS.DISPONIBLE ||
                !isSlotPast(slot.date, slot.startTime, now)
            )

        return (
          <div key={key} className={styles.dayColumn}>
            <div className={`${styles.dayHeader} ${isToday(day) ? styles.todayHeader : ''}`}>
              <span className={styles.dayName}>{formatDayName(day)}</span>
              <span className={styles.dayNumber}>{formatDayNumber(day)}</span>
            </div>

            <div className={styles.slotsContainer}>
              {slots.length === 0 ? (
                <p className={styles.emptyDay}>Sin atención</p>
              ) : visibleSlots.length === 0 ? (
                <p className={styles.emptyDay}>
                  {onlyReserved ? 'Sin turnos reservados' : 'Sin horarios disponibles'}
                </p>
              ) : (
                visibleSlots.map((slot) => (
                  <AppointmentSlot
                    key={slot.id}
                    slot={slot}
                    onClick={onSlotClick}
                    isPast={
                      slot.status === APPOINTMENT_STATUS.RESERVADO &&
                      isSlotPast(slot.date, slot.startTime, now)
                    }
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WeekCalendar
