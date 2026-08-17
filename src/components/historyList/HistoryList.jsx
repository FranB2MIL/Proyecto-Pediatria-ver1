import { useState, useEffect } from 'react'
import HistoryListItem from "../historyListItem/HistoryListItem"
import { getConsultationsByPatientId } from '../../services/consultationService'
import styles from './HistoryList.module.css'

const HistoryList = ({ id }) => {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  const sortedHistory = consultations
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className={styles.historylist}>
      <p className={styles.title}>Historial de consultas del paciente</p>
      <div className={styles.itemsContainer}>
        {loading && <p>Cargando historial...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && sortedHistory.map(c => (
          <HistoryListItem
            key={c.id}
            id={c.id}
            descripcion={c.reason}
            fechaCreacion={c.date}
            peso={c.measurement?.weight}
            altura={c.measurement?.height}
            talla={c.measurement?.size}
            imc={c.measurement?.imc}
          />
        ))}
      </div>
    </div>
  )
}

export default HistoryList