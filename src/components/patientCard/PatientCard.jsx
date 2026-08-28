import { useState, useEffect } from 'react'
import HistoryListItem from '../historyListItem/HistoryListItem'
import { getConsultationsByPatientId, createConsultation } from '../../services/consultationService'
import { updatePatient } from '../../services/patientService'
import CreateConsultationModal from '../../modal/CreateConsultationModal'
import CreateModal from '../../modal/CreatePacientModal'
import styles from './PatientCard.module.css'

const PatientCard = ({ id, firstName, lastName, dni, dateOfBirth, healthInsurance }) => {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen,setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [patientData, setPatientData] = useState({ firstName, lastName, dni, dateOfBirth, healthInsurance })

  useEffect(() => {
    setPatientData({ firstName, lastName, dni, dateOfBirth, healthInsurance })
  }, [id, firstName, lastName, dni, dateOfBirth, healthInsurance])

  const handleEditPatient = async (formData) => {
    try {
      await updatePatient(id, formData)
      setPatientData((prev) => ({ ...prev, ...formData }))
    } catch (err) {
      console.error("Error", err)
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
          <h2>{patientData.firstName} {patientData.lastName}</h2>
          <p>DNI: {patientData.dni}</p>
          <p>Fecha de nacimiento: {new Date(patientData.dateOfBirth).toLocaleDateString('es-AR')}</p>
          <p>Obra social: {patientData.healthInsurance}</p>
          <div className={styles.actions}>
            <button onClick={() => setIsModalOpen(true)} className={styles.primaryBtn}>
                + Nueva Consulta
            </button>
            <button onClick={() => setIsEditModalOpen(true)} className={styles.primaryBtn}>
                Editar paciente
            </button>
          </div>
          {/* TODO: chip de percentilo — pendiente hasta implementar cálculo OMS en el back */}
        </div>
      </div>


      {isModalOpen && (
        <CreateConsultationModal
        title = "Agregar Consulta"
        onClose = {() => setIsModalOpen(false)}
        onSave = {(pacientConsultation) => {
          handleAddConsultations(pacientConsultation)
          setIsModalOpen(false)
        }}
        />
      )}

      {isEditModalOpen && (
        <CreateModal
          modalTitle="Editar Paciente"
          initialData={{
            firstName: patientData.firstName,
            lastName: patientData.lastName,
            dni: patientData.dni,
            dateOfBirth: patientData.dateOfBirth?.slice(0, 10) ?? '',
            healthInsurance: patientData.healthInsurance,
          }}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(formData) => {
            handleEditPatient(formData)
            setIsEditModalOpen(false)
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