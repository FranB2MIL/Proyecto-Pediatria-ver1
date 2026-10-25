import { useState } from 'react'
import { unlinkPatient } from '../../services/patientService'
import CreateConsultationModal from '../../modal/CreateConsultationModal'
import ConfirmModal from '../../modal/ConfirmModal'
import LatestConsultation from '../latestConsultation/LatestConsultation'
import { formatDate } from '../../utils/dateUtils'
import { calculateAge, formatDni, getAvatarVariant } from '../../utils/patientFormat'
import styles from './PatientCard.module.css'


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

      <LatestConsultation consultation={latestConsultation} loading={loading} error={error} />

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
