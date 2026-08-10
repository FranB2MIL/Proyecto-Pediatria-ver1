import HistoryListItem from "../historyListItem/HistoryListItem"
import { HISTORIAL } from "../../data"
import styles from './HistoryList.module.css'

const HistoryList = (selectedPatient) => {
  const patientHistory = HISTORIAL.filter(h => h.pacienteId === selectedPatient?.id)
  return (
    <div className={styles.historylist}>
        <p className={styles.title}>Historial de consultas del paciente</p>
        <div className={styles.itemsContainer}>
          {patientHistory.map(h => (
              <HistoryListItem
                  key={h.id}
                  id={h.id}
                  descripcion={h.descripcion}
                  fechaCreacion={h.fechaCreacion}
                  peso={h.peso}
                  altura={h.altura}
                  talla={h.talla}
                  percentiloTallaEdad={h.percentiloTallaEdad}
                  percentilosPesoEdad={h.percentilosPesoEdad}
                  imc={h.imc}
              />
          ))}
        </div>
    </div>
  )
}

export default HistoryList