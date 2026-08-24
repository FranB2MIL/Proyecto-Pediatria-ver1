import styles from './WeekCalendar.module.css'
import AppointmentSlot from '../appointmentSlot/AppointmentSlot'
import { formatDayName, formatDayNumber, toDateKey, isToday } from '../../utils/dateUtils'

const WeekCalendar = ({ weekDays, slotsByDay, onSlotClick }) => {
  return (
    <div className={styles.calendar}>
      {weekDays.map((day) => {
        const key = toDateKey(day)
        const slots = slotsByDay[key] ?? []

        return (
          <div key={key} className={styles.dayColumn}>
            <div className={`${styles.dayHeader} ${isToday(day) ? styles.todayHeader : ''}`}>
              <span className={styles.dayName}>{formatDayName(day)}</span>
              <span className={styles.dayNumber}>{formatDayNumber(day)}</span>
            </div>

            <div className={styles.slotsContainer}>
              {slots.length === 0 ? (
                <p className={styles.emptyDay}>Sin atención</p>
              ) : (
                slots.map((slot) => (
                  <AppointmentSlot key={slot.id} slot={slot} onClick={onSlotClick} />
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
