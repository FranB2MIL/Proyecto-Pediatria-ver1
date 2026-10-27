import { APPOINTMENT_STATUS } from '../../constants/appointmentStatus'
import { formatDayNumber, formatLongDate, formatMonthShort, parseLocalDate } from '../../utils/dateUtils'
import styles from './AppointmentItem.module.css'

const STATUS_CLASSES = {
  [APPOINTMENT_STATUS.RESERVADO]: styles.statusOk,
  [APPOINTMENT_STATUS.CANCELADO]: styles.statusWarn,
}

const STATUS_LABELS = {
  [APPOINTMENT_STATUS.RESERVADO]: 'Confirmado',
  [APPOINTMENT_STATUS.CANCELADO]: 'Cancelado',
}

// Tarjeta de un turno (fecha, hora, persona, estado). Compartida por la lista y el modal
const AppointmentItem = ({ appointment, onCancelAppointment }) => {
  const isCancelled = appointment.status === APPOINTMENT_STATUS.CANCELADO
  const canCancel = Boolean(onCancelAppointment) && appointment.status === APPOINTMENT_STATUS.RESERVADO
  // Cada vista recibe uno solo: el paciente ve al doctor (/me/appointments), el doctor al paciente (/appointment)
  const personName = appointment.doctorName || appointment.patientName
  return (
    <li className={`${styles.item} ${isCancelled ? styles.itemCancelled : ''}`}>
      <div className={styles.dateBlock} aria-hidden="true">
        <span className={styles.dayNumber}>
          {formatDayNumber(parseLocalDate(appointment.date))}
        </span>
        <span className={styles.month}>{formatMonthShort(appointment.date)}</span>
      </div>
      <div className={styles.details}>
        <span className={styles.when}>{formatLongDate(appointment.date)}</span>
        {/* Espacio de no separación: la hora y la "h" nunca quedan en líneas distintas */}
        <span className={styles.time}>{appointment.startTime}&nbsp;h</span>
        {personName && (
          <span className={styles.doctor}>{personName}</span>
        )}
        <div className={styles.statusRow}>
          <span className={STATUS_CLASSES[appointment.status] ?? styles.statusNeutral}>
            {STATUS_LABELS[appointment.status] ?? appointment.status}
          </span>
          {canCancel && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => onCancelAppointment(appointment)}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </li>
  )
}

export default AppointmentItem
