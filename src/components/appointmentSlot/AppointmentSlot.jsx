import styles from './AppointmentSlot.module.css'
import { APPOINTMENT_STATUS } from '../../data/mockAppointments'

// Maps the state of the appointment to the corresponding CSS class.
// 
// Same color pattern as utils/percentileStatus.js: green = everything's ok!
// red = requires atention, neutral = empty.

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
