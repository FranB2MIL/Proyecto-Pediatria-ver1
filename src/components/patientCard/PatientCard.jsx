import { HISTORIAL } from '../../data'
import HistoryListItem from '../historyListItem/HistoryListItem'
import { getPercentileStatus } from '../../utils/percentileStatus'
import styles from './PatientCard.module.css'

const PatientCard = ({id, nombre, apellido, dni, fechaNacimiento, obraSocial, history }) => {
  const patientLatestHistory = HISTORIAL.filter(h => h.pacienteId === id).sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))[0]
  const percentileStatus = patientLatestHistory ? getPercentileStatus(patientLatestHistory.percentiloTallaEdad) : null
  return (
    <div className={styles.patientcard}>
      <div className={styles.topRow}>
        <div className={styles.avatarBlock} />
        <div className={styles.infoBlock}>
          <h2>{nombre} {apellido}</h2>
          <p>DNI: {dni}</p>
          <p>Fecha de nacimiento: {fechaNacimiento}</p>
          <p>Obra social: {obraSocial}</p>
          {percentileStatus && (
            <span
              className={styles.percentileChip}
              style={{ background: percentileStatus.bg, color: percentileStatus.textColor }}
            >
              <span className={styles.percentileDot} style={{ background: percentileStatus.dotColor }} />
              Percentilo {patientLatestHistory.percentiloTallaEdad} · {percentileStatus.label}
            </span>
          )}
        </div>
      </div>
      <div className={styles.summaryStrip}>
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

