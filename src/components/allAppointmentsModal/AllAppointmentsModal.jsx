import Modal from 'react-bootstrap/Modal'
import AppointmentItem from '../appointmentItem/AppointmentItem'
import styles from './AllAppointmentsModal.module.css'

// Todos los turnos futuros del paciente, en secciones Activos / Cancelados.
// react-bootstrap resuelve role="dialog", aria-modal, Escape, clic fuera, foco atrapado,
// devolución del foco al botón que lo abrió y el bloqueo de scroll del fondo.
const AllAppointmentsModal = ({
  show, activeAppointments, cancelledAppointments, onCancelAppointment, onClose,
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      scrollable
      dialogClassName={styles.dialog}
      aria-labelledby="all-appointments-title"
    >
      <Modal.Header closeButton closeLabel="Cerrar">
        <Modal.Title id="all-appointments-title" className={styles.modalTitle}>Mis turnos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {activeAppointments.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Activos ({activeAppointments.length})</h3>
            <ul className={styles.list}>
              {activeAppointments.map(appointment => (
                <AppointmentItem
                  key={appointment.id}
                  appointment={appointment}
                  onCancelAppointment={onCancelAppointment}
                />
              ))}
            </ul>
          </section>
        )}
        {cancelledAppointments.length > 0 && (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Cancelados ({cancelledAppointments.length})</h3>
            <ul className={styles.list}>
              {cancelledAppointments.map(appointment => (
                <AppointmentItem key={appointment.id} appointment={appointment} />
              ))}
            </ul>
          </section>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default AllAppointmentsModal
