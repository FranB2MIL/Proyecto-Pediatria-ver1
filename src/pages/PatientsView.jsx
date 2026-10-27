import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import PatientList from '../components/patientList/PatientList'
import PatientCard from '../components/patientCard/PatientCard'
import HistoryList from '../components/historyList/HistoryList'
import UpcomingAppointments from '../components/upcomingAppointments/UpcomingAppointments'
import PatientConfirmModal from '../modal/PatientConfirmModal'
import { useConsultations } from '../hooks/useConsultations'
import { usePatients } from '../hooks/usePatients'
import { useUpcomingAppointments } from '../hooks/useUpcomingAppointments'
import { formatLongDate } from '../utils/dateUtils'
import styles from './PatientsView.module.css'

function PatientsView() {
  const navigate = useNavigate()
  // El id vive en DoctorLayout (persiste al ir a /turnos); el paciente se resuelve desde la lista
  const { selectedPatientId, setSelectedPatientId } = useOutletContext()
  const [deletedPatientId, setDeletedPatientId] = useState(null)

  const patientList = usePatients(deletedPatientId)
  const selectedPatient = patientList.patients.find((p) => p.id === selectedPatientId) ?? null

  // Si el paciente ya no está en la lista (lo quitaron mientras estábamos en otra vista),
  // se olvida el id para que no reaparezca seleccionado si se lo vuelve a vincular
  useEffect(() => {
    if (!patientList.loading && !patientList.error && selectedPatientId != null && !selectedPatient) {
      setSelectedPatientId(null)
    }
  }, [patientList.loading, patientList.error, selectedPatientId, selectedPatient, setSelectedPatientId])

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
    setSelectedPatientId(patient.id)
  }

  const handleDeletePatient = (id) => {
    setSelectedPatientId(null)
    setDeletedPatientId(id)
  }

  // Al volver de /turnos la lista se vuelve a pedir: mientras tanto no se muestra
  // "Seleccioná un paciente" si había uno seleccionado
  const resolvingSelection = patientList.loading && selectedPatientId != null

  return (
    <div className={styles.pageContainer}>
      <PatientList
        patients={patientList.patients}
        loading={patientList.loading}
        error={patientList.error}
        onPatientLinked={patientList.reload}
        onSelectPatient={handleSelectPatient}
        selectedPatientId={selectedPatient?.id}
      />
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
        ) : !resolvingSelection && (
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
