import { APPOINTMENT_STATUS } from '../../data/mockAppointments'
import { formatDayNumber, formatLongDate, formatMonthShort, parseLocalDate } from '../../utils/dateUtils'
import styles from './UpcomingAppointments.module.css'

const STATUS_CLASSES = {
  [APPOINTMENT_STATUS.RESERVADO]: styles.statusOk,
  [APPOINTMENT_STATUS.CANCELADO]: styles.statusWarn,
}

const STATUS_LABELS = {
  [APPOINTMENT_STATUS.RESERVADO]: 'Confirmado',
  [APPOINTMENT_STATUS.CANCELADO]: 'Cancelado',
}

const UpcomingAppointments = ({ appointments, loading, error, onAddAppointment }) => {
  return (
    <section className={styles.upcoming}>
      <div className={styles.header}>
        <h2 className={styles.title}>Próximos turnos</h2>
        {onAddAppointment && (
          <button
            type="button"
            className={styles.addButton}
            onClick={onAddAppointment}
            aria-label="Agendar turno"
            title="Agendar turno"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {loading && <p className={styles.stateMessage}>Cargando turnos...</p>}
      {!loading && error && <p className={styles.stateMessage}>Error: {error}</p>}
      {!loading && !error && appointments.length === 0 && (
        <p className={styles.stateMessage}>No tenés turnos agendados.</p>
      )}
      {!loading && !error && appointments.length > 0 && (
        <ul className={styles.list}>
          {appointments.map(appointment => {
            const isCancelled = appointment.status === APPOINTMENT_STATUS.CANCELADO
            return (
              <li
                key={appointment.id}
                className={`${styles.item} ${isCancelled ? styles.itemCancelled : ''}`}
              >
                <div className={styles.dateBlock} aria-hidden="true">
                  <span className={styles.dayNumber}>
                    {formatDayNumber(parseLocalDate(appointment.date))}
                  </span>
                  <span className={styles.month}>{formatMonthShort(appointment.date)}</span>
                </div>
                <div className={styles.details}>
                  <span className={styles.when}>
                    {formatLongDate(appointment.date)} · {appointment.startTime} h
                  </span>
                  {appointment.doctorName && (
                    <span className={styles.doctor}>{appointment.doctorName}</span>
                  )}
                </div>
                <span className={STATUS_CLASSES[appointment.status] ?? styles.statusNeutral}>
                  {STATUS_LABELS[appointment.status] ?? appointment.status}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default UpcomingAppointments
