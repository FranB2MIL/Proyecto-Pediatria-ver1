import styles from './CalendarToolbar.module.css'
import { formatWeekRange } from '../../utils/dateUtils'

const CalendarToolbar = ({ referenceDate, onPrevWeek, onNextWeek, onToday, onConfigureAvailability }) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.navGroup}>
        <button className={styles.navButton} onClick={onPrevWeek} aria-label="Semana anterior">
          ‹
        </button>
        <button className={styles.todayButton} onClick={onToday}>
          Hoy
        </button>
        <button className={styles.navButton} onClick={onNextWeek} aria-label="Semana siguiente">
          ›
        </button>
      </div>

      <p className={styles.weekRange}>{formatWeekRange(referenceDate)}</p>

      <button className={styles.configButton} onClick={onConfigureAvailability}>
        Configurar disponibilidad
      </button>
    </div>
  )
}

export default CalendarToolbar
