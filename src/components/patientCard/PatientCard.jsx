import { HISTORIAL } from '../../data'
import HistoryListItem from '../historyListItem/HistoryListItem'
import styles from './PatientCard.module.css'

const PatientCard = ({id, nombre, apellido, dni, fechaNacimiento, obraSocial, history }) => {
  const patientLatestHistory = HISTORIAL.filter(h => h.pacienteId === id).sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))[0]
  return (
    <div className={styles.patientcard}>
      <h2>{nombre} {apellido}</h2>
      <p>DNI: {dni}</p>
      <p>Fecha de nacimiento: {fechaNacimiento}</p>
      <p>Obra social: {obraSocial}</p>
      <div>
        {patientLatestHistory ? (
          <HistoryListItem
            key={patientLatestHistory.id}
            id={patientLatestHistory.id}
            fechaCreacion={patientLatestHistory.fechaCreacion}
            peso={patientLatestHistory.peso}
            altura={patientLatestHistory.altura}
            talla={patientLatestHistory.talla}
            percentiloTallaEdad={patientLatestHistory.percentiloTallaEdad}
            percentilosPesoEdad={patientLatestHistory.percentilosPesoEdad}
            imc={patientLatestHistory.imc}
          />
        ) : (
          <p>No hay historial disponible</p>
        )}
      </div>
    </div>
  )
}

export default PatientCard

