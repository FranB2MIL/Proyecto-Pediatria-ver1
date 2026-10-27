import { useState } from 'react'
import AppointmentItem from '../appointmentItem/AppointmentItem'
import AllAppointmentsModal from '../allAppointmentsModal/AllAppointmentsModal'
import { MAX_VISIBLE_APPOINTMENTS } from '../../utils/upcomingAppointments'
import styles from './UpcomingAppointments.module.css'

// appointments: turnos activos; cancelledAppointments: cancelados.
// Ambos llegan completos: acá se recortan los activos al tope y el modal "Mis turnos" muestra todos.
// actionLabel (opcional): en lugar del "+", un botón con ese texto que también dispara onAddAppointment
const UpcomingAppointments = ({
  appointments,
  cancelledAppointments = [],
  loading,
  error,
  emptyMessage = 'No tenés turnos agendados',
  onAddAppointment,
  actionLabel,
  onCancelAppointment,
}) => {
  const [showAllModal, setShowAllModal] = useState(false)

  const visibleAppointments = appointments.slice(0, MAX_VISIBLE_APPOINTMENTS)
  const totalCount = appointments.length + cancelledAppointments.length
  // Hay algo que la tarjeta no muestra: activos de más o cualquier cancelado
  const hasHidden = appointments.length > MAX_VISIBLE_APPOINTMENTS || cancelledAppointments.length > 0
  const ready = !loading && !error

  return (
    <section className={styles.upcoming}>
      <div className={styles.header}>
        <h2 className={styles.title}>Próximos turnos</h2>
        {onAddAppointment && actionLabel && (
          <button type="button" className={styles.actionButton} onClick={onAddAppointment}>
            {actionLabel}
          </button>
        )}
        {onAddAppointment && !actionLabel && (
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
      {ready && appointments.length === 0 && (
        <p className={styles.stateMessage}>{emptyMessage}</p>
      )}
      {ready && appointments.length > 0 && (
        <ul className={styles.list}>
          {visibleAppointments.map(appointment => (
            <AppointmentItem
              key={appointment.id}
              appointment={appointment}
              onCancelAppointment={onCancelAppointment}
            />
          ))}
        </ul>
      )}
      {ready && hasHidden && (
        <button type="button" className={styles.toggleButton} onClick={() => setShowAllModal(true)}>
          Ver todos ({totalCount})
        </button>
      )}

      {ready && (
        <AllAppointmentsModal
          show={showAllModal}
          activeAppointments={appointments}
          cancelledAppointments={cancelledAppointments}
          onCancelAppointment={onCancelAppointment}
          onClose={() => setShowAllModal(false)}
        />
      )}
    </section>
  )
}

export default UpcomingAppointments
