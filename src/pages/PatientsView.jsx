import { useState } from 'react'
import PatientList from '../components/patientList/PatientList'
import PatientCard from '../components/patientCard/PatientCard'
import HistoryList from '../components/historyList/HistoryList'
import { useConsultations } from '../hooks/useConsultations'
import styles from './PatientsView.module.css'

function PatientsView() {
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
    </div>
  )
}

export default PatientsView