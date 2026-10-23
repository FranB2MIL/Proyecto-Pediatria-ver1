import { useState } from 'react'
import { unlinkPatient } from '../../services/patientService'
import CreateConsultationModal from '../../modal/CreateConsultationModal'
import ConfirmModal from '../../modal/ConfirmModal'
import { formatDate, formatShortDate } from '../../utils/dateUtils'
import { calculateAge, formatDni, formatMeasure, getAvatarVariant } from '../../utils/patientFormat'
import { getPercentileStatus } from '../../utils/percentileStatus'
import styles from './PatientCard.module.css'
import { heightInCm, headCircumferenceInCm } from '../../utils/measurement'

const AVATAR_CLASSES = {
  green: styles.avatarGreen,
  red: styles.avatarRed,
  amber: styles.avatarAmber,
}

const formatAge = (age) => {
  if (age === null) return '—'
  return age === 1 ? '1 año' : `${age} años`
}

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

  const fullName = `${firstName} ${lastName}`
  const initial = firstName?.charAt(0).toUpperCase()
  const avatarClass = AVATAR_CLASSES[getAvatarVariant(fullName)]

  const facts = [
    { label: 'DNI', value: formatDni(dni) },
    { label: 'Edad', value: formatAge(calculateAge(dateOfBirth)) },
    { label: 'Nacimiento', value: formatDate(dateOfBirth) },
    { label: 'Obra social', value: healthInsurance?.trim() || 'Sin obra social' },
  ]

  const measurement = latestConsultation?.measurement
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
    <div className={styles.patientcard}>
      <section className={styles.header}>
        <div className={styles.identity}>
          <div className={`${styles.avatar} ${avatarClass}`} aria-hidden="true">
            {initial}
          </div>
          <div className={styles.identityText}>
            <h1 className={styles.name}>{fullName}</h1>
            <dl className={styles.facts}>
              {facts.map(fact => (
                <div key={fact.label} className={styles.fact}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={() => setIsUnlinkModalOpen(true)} className={styles.secondaryBtn}>
            Quitar de mi lista
          </button>
          <button onClick={() => setIsModalOpen(true)} className={styles.primaryBtn}>
            + Nueva consulta
          </button>
        </div>
      </section>

      {actionError && <p className={styles.actionError} role="alert">{actionError}</p>}

      <section className={styles.latest}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Última consulta</h2>
          {!loading && !error && latestConsultation && (
            <span className={styles.meta}>
              {formatShortDate(latestConsultation.date)}
              {latestConsultation.reason && ` · ${latestConsultation.reason}`}
            </span>
          )}
        </div>

        {loading && <p className={styles.stateMessage}>Cargando historial...</p>}
        {!loading && error && <p className={styles.stateMessage}>Error: {error}</p>}
        {!loading && !error && !latestConsultation && (
          <p className={styles.stateMessage}>Todavía no hay consultas</p>
        )}
        {!loading && !error && latestConsultation && (
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
    </div>
  )
}

export default PatientCard
