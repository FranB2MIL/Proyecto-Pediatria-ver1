import styles from './AppointmentSlot.module.css'
import { APPOINTMENT_STATUS } from '../../data/mockAppointments'

// Mapea el estado del turno a la clase CSS que le corresponde.
// Mismo criterio de colores que utils/percentileStatus.js: verde = todo bien,
// ámbar = requiere atención, neutro = vacío.
const STATUS_CLASS = {
  [APPOINTMENT_STATUS.DISPONIBLE]: styles.free,
  [APPOINTMENT_STATUS.RESERVADO]: styles.booked,
  [APPOINTMENT_STATUS.CANCELADO]: styles.cancelled,
}

const AppointmentSlot = ({ slot, onClick }) => {
  const statusClass = STATUS_CLASS[slot.status] ?? styles.free

  return (
    <button
      type="button"
      className={`${styles.slot} ${statusClass}`}
      onClick={() => onClick(slot)}
    >
      <span className={styles.time}>{slot.startTime}</span>
      <span className={styles.label}>
        {slot.appointment ? slot.appointment.patientName : 'Libre'}
      </span>
    </button>
  )
}

export default AppointmentSlot
