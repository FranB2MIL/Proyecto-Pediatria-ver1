import styles from './CalendarToolbar.module.css'
import { formatWeekRange } from '../../utils/dateUtils'

const CalendarToolbar = ({ referenceDate, onPrevWeek, onNextWeek, onToday, onConfigureAvailability, onRefresh, refreshing, onlyReserved, onToggleOnlyReserved }) => {
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
      <div className={styles.rightActions}>
        <button
          type="button"
          className={`${styles.toggleBtn} ${onlyReserved ? styles.toggleBtnActive : ''}`}
          onClick={onToggleOnlyReserved}
          aria-pressed={onlyReserved}
        >
          Solo reservados
        </button>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Actualizando...' : 'Actualizar turnos'}
        </button>
        <button className={styles.configButton} onClick={onConfigureAvailability}>
          Configurar disponibilidad
        </button>
      </div>
    </div>
  )
}

export default CalendarToolbar
