import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PatientList from '../components/patientList/PatientList'
import PatientCard from '../components/patientCard/PatientCard'
import HistoryList from '../components/historyList/HistoryList'
import UpcomingAppointments from '../components/upcomingAppointments/UpcomingAppointments'
import PatientConfirmModal from '../modal/PatientConfirmModal'
import { useConsultations } from '../hooks/useConsultations'
import { useUpcomingAppointments } from '../hooks/useUpcomingAppointments'
import { formatLongDate } from '../utils/dateUtils'
import styles from './PatientsView.module.css'

function PatientsView() {
  const navigate = useNavigate()
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [deletedPatientId, setDeletedPatientId] = useState(null)

  const {
    consultations,
    loading,
    error,
    addConsultation,
    editConsultation,
    removeConsultation,
  } = useConsultations(selectedPatient?.id)

  // Al borrar un paciente se recargan los turnos (pueden haber sido suyos)
  const upcoming = useUpcomingAppointments(deletedPatientId)

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient)
  }

  const handleDeletePatient = (id) => {
    setSelectedPatient(null)
    setDeletedPatientId(id)
  }

  return (
    <div className={styles.pageContainer}>
      <PatientList onSelectPatient={handleSelectPatient} deletedPatientId={deletedPatientId} selectedPatientId={selectedPatient?.id} />
      <div className={styles.infoColumn}>
        {selectedPatient ? (
          <>
            <div className={styles.cardSection}>
              <PatientCard
                {...selectedPatient}
                onDelete={handleDeletePatient}
                latestConsultation={consultations[0]}
                loading={loading}
                error={error}
                onCreateConsultation={addConsultation}
              />
            </div>
            <div className={styles.historySection}>
              <HistoryList
                consultations={consultations}
                loading={loading}
                error={error}
                onEditConsultation={editConsultation}
                onDeleteConsultation={removeConsultation}
              />
            </div>
          </>
        ) : (
          <p>Seleccioná un paciente de la lista para ver su información</p>
        )}
      </div>
      <aside className={styles.sideColumn}>
        <UpcomingAppointments
          appointments={upcoming.active}
          cancelledAppointments={upcoming.cancelled}
          loading={upcoming.loading}
          error={upcoming.error}
          emptyMessage="No tenés turnos próximos"
          onAddAppointment={() => navigate('/turnos')}
          actionLabel="Ver agenda"
          onCancelAppointment={upcoming.requestCancel}
        />
      </aside>

      {upcoming.appointmentToCancel && (
        <PatientConfirmModal
          title="Cancelar turno"
          confirmLabel="Cancelar turno"
          cancelLabel="Volver"
          danger
          submitting={upcoming.cancelling}
          error={upcoming.cancelError}
          onConfirm={upcoming.confirmCancel}
          onClose={upcoming.closeCancel}
        >
          <p>¿Querés cancelar este turno?</p>
          <p>{upcoming.appointmentToCancel.patientName}</p>
          <p>{formatLongDate(upcoming.appointmentToCancel.date)} · {upcoming.appointmentToCancel.startTime} h</p>
        </PatientConfirmModal>
      )}
    </div>
  )
}

export default PatientsView
