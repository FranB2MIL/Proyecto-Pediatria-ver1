import { useState, useEffect } from 'react'
import HistoryListItem from '../historyListItem/HistoryListItem'
import { getConsultationsByPatientId } from '../../services/consultationService'
import CreateConsultationModal from '../../modal/CreateConsultationModal'
import styles from './PatientCard.module.css'

const PatientCard = ({ id, firstName, lastName, dni, dateOfBirth, healthInsurance }) => {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen,setIsModalOpen] = useState(false)

  const handleAddConsultations = (consultationData) => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5072/api/Consultation/patient/${id}`, {
      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${token}` 
      },
      body: JSON.stringify({
        date : consultationData.date,
        reason : consultationData.reason,
        description : consultationData.description,
        measurement : {
                weight: Number(consultationData.measurement.weight) || 0,
                height: Number(consultationData.measurement.height) || 0,
                size: Number(consultationData.measurement.size) || 0
        }
      })
    })
    .then(res => {
      if(res.ok){
        return res.json();
      }
      throw  new Error("error al crear la consulta");
    })
    .then(newConsultation => {
      setConsultations((prev) => [...prev, newConsultation]);
    })
    .catch((err)=> {
      console.log("Error", err);
    })

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
          <button  onClick={() => setIsModalOpen(true)} className={styles.primaryBtn}>
  
              + Nueva Consulta 
          </button>
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