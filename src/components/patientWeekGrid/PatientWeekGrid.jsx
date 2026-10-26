import { formatDayName, formatDayNumber, toDateKey, isToday } from '../../utils/dateUtils'
import styles from './PatientWeekGrid.module.css'

// Grilla de solo lectura: solo muestra los horarios libres que ofrece el back.
// Desktop: una columna por día con sus horarios apilados. Angosto: lista apilada por día.
const PatientWeekGrid = ({ weekDays, slots, onSelectSlot }) => {
  const dayHeader = (day) => (
    <>
      <span className={styles.dayName}>{formatDayName(day)}</span>
      <span className={styles.dayNumber}>{formatDayNumber(day)}</span>
    </>
  )

  return (
    <>
      <div className={styles.grid}>
        {weekDays.map(day => {
          const key = toDateKey(day)
          const daySlots = slots.filter(slot => slot.date === key).sort((a, b) => a.startTime.localeCompare(b.startTime))
          return (
            <div key={key} className={styles.dayColumn}>
              <div className={`${styles.dayHeader} ${isToday(day) ? styles.today : ''}`}>
                {dayHeader(day)}
              </div>
              <div className={styles.daySlots}>
                {daySlots.length === 0 ? (
                  <p className={styles.emptyDay}>Sin horarios</p>
                ) : (
                  daySlots.map(slot => (
                    <button
                      key={slot.startTime}
                      type="button"
                      className={styles.slot}
                      onClick={() => onSelectSlot(slot)}
                    >
                      {slot.startTime}
                    </button>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.list}>
        {weekDays.map(day => {
          const key = toDateKey(day)
          const daySlots = slots.filter(slot => slot.date === key).sort((a, b) => a.startTime.localeCompare(b.startTime))
          if (daySlots.length === 0) return null
          return (
            <section key={key} className={styles.listDay}>
              <h3 className={`${styles.listDayHeader} ${isToday(day) ? styles.today : ''}`}>
                {dayHeader(day)}
              </h3>
              <div className={styles.listSlots}>
                {daySlots.map(slot => (
                  <button
                    key={slot.startTime}
                    type="button"
                    className={styles.slot}
                    onClick={() => onSelectSlot(slot)}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}

export default PatientWeekGrid
