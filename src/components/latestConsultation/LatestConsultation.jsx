import { formatShortDate } from '../../utils/dateUtils'
import { formatMeasure } from '../../utils/patientFormat'
import { getPercentileStatus } from '../../utils/percentileStatus'
import { heightInCm, headCircumferenceInCm } from '../../utils/measurement'
import styles from './LatestConsultation.module.css'

const LatestConsultation = ({ consultation, loading, error }) => {
  const measurement = consultation?.measurement
  const measureTiles = [
    { label: 'Peso', value: formatMeasure(measurement?.weight), unit: 'kg' },
    { label: 'Talla', value: formatMeasure(heightInCm(measurement)), unit: 'cm' },
    { label: 'P. cefálico', value: formatMeasure(headCircumferenceInCm(measurement)), unit: 'cm' },
    { label: 'IMC', value: formatMeasure(measurement?.imc, { decimals: 2 }) },
  ]
  const percentileTiles = [
    { label: 'Percentil talla/edad', value: measurement?.heightAgePercentile },
    { label: 'Percentil peso/edad', value: measurement?.weightAgePercentile },
  ]

  return (
    <section className={styles.latest}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Última consulta</h2>
        {!loading && !error && consultation && (
          <span className={styles.meta}>
            {formatShortDate(consultation.date)}
            {consultation.reason && ` · ${consultation.reason}`}
          </span>
        )}
      </div>

      {loading && <p className={styles.stateMessage}>Cargando historial...</p>}
      {!loading && error && <p className={styles.stateMessage}>Error: {error}</p>}
      {!loading && !error && !consultation && (
        <p className={styles.stateMessage}>Todavía no hay consultas</p>
      )}
      {!loading && !error && consultation && (
        <div className={styles.tiles}>
          {measureTiles.map(tile => (
            <div key={tile.label} className={styles.tile}>
              <span className={styles.tileLabel}>{tile.label}</span>
              <span className={styles.tileValue}>
                {tile.value}
                {tile.unit && tile.value !== '—' && <span className={styles.tileUnit}>{tile.unit}</span>}
              </span>
            </div>
          ))}
          {percentileTiles.map(tile => {
            const status = getPercentileStatus(tile.value)
            if (!status) {
              return (
                <div key={tile.label} className={`${styles.tile} ${styles.tilePending}`}>
                  <span className={styles.tileLabel}>{tile.label}</span>
                  <span className={styles.tilePendingValue}>Próximamente</span>
                </div>
              )
            }
            return (
              <div key={tile.label} className={styles.tile}>
                <span className={styles.tileLabel}>{tile.label}</span>
                <span className={styles.tileValue}>{formatMeasure(tile.value)}</span>
                <span className={status.label === 'normal' ? styles.percentileOk : styles.percentileWarn}>
                  {status.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default LatestConsultation
