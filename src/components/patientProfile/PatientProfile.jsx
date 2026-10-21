import { formatDate } from '../../utils/dateUtils'
import { calculateAge, formatDni, getAvatarVariant } from '../../utils/patientFormat'
import styles from './PatientProfile.module.css'

const AVATAR_CLASSES = {
  green: styles.avatarGreen,
  red: styles.avatarRed,
  amber: styles.avatarAmber,
}

const formatAge = (age) => {
  if (age === null) return '—'
  return age === 1 ? '1 año' : `${age} años`
}

// Ficha del propio paciente: solo lectura, sin acciones del doctor
const PatientProfile = ({
  firstName, lastName, dni, dateOfBirth, healthInsurance, insuranceNumber, email, phoneNumber,
}) => {
  const fullName = `${firstName} ${lastName}`
  const initial = firstName?.charAt(0).toUpperCase()
  const avatarClass = AVATAR_CLASSES[getAvatarVariant(fullName)]

  const facts = [
    { label: 'DNI', value: formatDni(dni) },
    { label: 'Edad', value: formatAge(calculateAge(dateOfBirth)) },
    { label: 'Nacimiento', value: formatDate(dateOfBirth) },
    { label: 'Obra social', value: healthInsurance?.trim() || 'Sin obra social' },
    { label: 'N.º de afiliado', value: insuranceNumber?.trim() || '—' },
  ]
  const contact = [
    { label: 'Email', value: email || '—' },
    { label: 'Teléfono', value: phoneNumber || '—' },
  ]

  return (
    <section className={styles.profile}>
      <div className={styles.identity}>
        <div className={`${styles.avatar} ${avatarClass}`} aria-hidden="true">
          {initial}
        </div>
        <div className={styles.identityText}>
          <span className={styles.eyebrow}>Mi ficha</span>
          <h1 className={styles.name}>{fullName}</h1>
        </div>
      </div>
      <dl className={styles.facts}>
        {[...facts, ...contact].map(fact => (
          <div key={fact.label} className={styles.fact}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default PatientProfile
