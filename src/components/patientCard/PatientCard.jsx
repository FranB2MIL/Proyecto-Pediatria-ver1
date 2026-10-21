import { useState } from 'react'
import HistoryListItem from '../historyListItem/HistoryListItem'
import { unlinkPatient } from '../../services/patientService'
import CreateConsultationModal from '../../modal/CreateConsultationModal'
import ConfirmModal from '../../modal/ConfirmModal'
import styles from './PatientCard.module.css'

const PatientCard = ({
  id, firstName, lastName, dni, dateOfBirth, healthInsurance, onDelete,
  latestConsultation, loading, error, onCreateConsultation,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false)
  const [actionError, setActionError] = useState(null)

  const handleUnlinkPatient = async () => {
    try {
      setActionError(null)
      await unlinkPatient(id)
      onDelete(id)
    } catch (err) {
      setActionError(`No se pudo quitar al paciente: ${err.message}`)
    }
  }

  const handleAddConsultation = async (formData) => {
    try {
      setActionError(null)
      await onCreateConsultation(formData)
    } catch (err) {
      setActionError(`No se pudo crear la consulta: ${err.message}`)
    }
  }

  return (
    <div className={styles.patientcard}>
      <div className={styles.topRow}>
        <div className={styles.avatarBlock} />
        <div className={styles.infoBlock}>
          <h2>{firstName} {lastName}</h2>
          <p>DNI: {dni}</p>
          <p>Fecha de nacimiento: {new Date(dateOfBirth).toLocaleDateString('es-AR')}</p>
          <p>Obra social: {healthInsurance}</p>
          <div className={styles.actions}>
            <button onClick={() => setIsModalOpen(true)} className={styles.primaryBtn}>
              + Nueva Consulta
            </button>
            <button onClick={() => setIsUnlinkModalOpen(true)} className={styles.dangerBtn}>
              Quitar de mi lista
            </button>
            {isUnlinkModalOpen && (
              <ConfirmModal
                message={`¿Querés quitar a ${firstName} ${lastName} de tu lista? Sus consultas no se borran.`}
                onConfirm={() => {
                  handleUnlinkPatient()
                  setIsUnlinkModalOpen(false)
                }}
                onClose={() => setIsUnlinkModalOpen(false)}
              />
            )}
          </div>
          {actionError && <p>{actionError}</p>}
          {/* TODO: chip de percentilo — pendiente hasta implementar cálculo OMS en el back */}
        </div>
      </div>

      {isModalOpen && (
        <CreateConsultationModal
          modalTitle="Agregar Consulta"
          onClose={() => setIsModalOpen(false)}
          onSave={(formData) => {
            handleAddConsultation(formData)
            setIsModalOpen(false)
          }}
        />
      )}

      <div className={styles.summaryStrip}>
        {loading && <p>Cargando historial...</p>}
        {!loading && error && <p>Error: {error}</p>}
        {!loading && !error && (
          latestConsultation ? (
            <HistoryListItem
              key={latestConsultation.id}
              id={latestConsultation.id}
              fechaCreacion={latestConsultation.date}
              peso={latestConsultation.measurement?.weight}
              altura={latestConsultation.measurement?.height}
              talla={latestConsultation.measurement?.size}
              imc={latestConsultation.measurement?.imc}
            />
          ) : (
            <p>No hay historial disponible</p>
          )
        )}
      </div>
    </div>
  )
}

export default PatientCard