import HistoryListItem from "../historyListItem/HistoryListItem"
import { HISTORIAL } from "../../data"

const HistoryList = (selectedPatient) => {
  const patientHistory = HISTORIAL.filter(h => h.pacienteId === selectedPatient?.id)
  return (
    <div>
        Historial de consultas del paciente
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
  )
}

export default HistoryList