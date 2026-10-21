import { useState, useEffect } from 'react'
import HistoryListItem from '../historyListItem/HistoryListItem'
import { getConsultationsByPatientId, createConsultation } from '../../services/consultationService'
import { unlinkPatient } from '../../services/patientService'
import CreateConsultationModal from '../../modal/CreateConsultationModal'
import ConfirmModal from '../../modal/ConfirmModal'
import styles from './PatientCard.module.css'

const PatientCard = ({ id, firstName, lastName, dni, dateOfBirth, healthInsurance, onDelete }) => {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false)
  const [unlinkError, setUnlinkError] = useState(null)

  const handleUnlinkPatient = async () => {
    try {
      setUnlinkError(null)
      await unlinkPatient(id)
      onDelete(id)
    } catch (err) {
      setUnlinkError(err.message)
    }
  }

  const handleAddConsultations = async (consultationData) => {
    try {
      const newConsultation = await createConsultation(id, {
        date: consultationData.date,
        reason: consultationData.reason,
        description: consultationData.description,
        measurement: {
          weight: Number(consultationData.measurement.weight) || 0,
          height: Number(consultationData.measurement.height) || 0,
          size: Number(consultationData.measurement.size) || 0
        }
      })
      setConsultations((prev) => [...prev, newConsultation])
    } catch (err) {
      console.log("Error", err)
    }
  }

  useEffect(() => {
    async function fetchConsultations() {
      try {
        const data = await getConsultationsByPatientId(id)
        setConsultations(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [id])

  const latestConsultation = consultations
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]

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
          {unlinkError && <p>No se pudo quitar al paciente: {unlinkError}</p>}
          {/* TODO: chip de percentilo — pendiente hasta implementar cálculo OMS en el back */}
        </div>
      </div>

      {isModalOpen && (
        <CreateConsultationModal
          modalTitle="Agregar Consulta"
          onClose={() => setIsModalOpen(false)}
          onSave={(pacientConsultation) => {
            handleAddConsultations(pacientConsultation)
            setIsModalOpen(false)
          }}
        />
      )}

      <div className={styles.summaryStrip}>
        {loading && <p>Cargando historial...</p>}
        {error && <p>Error: {error}</p>}
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