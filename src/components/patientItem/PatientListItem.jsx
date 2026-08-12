import styles from './PatientListItem.module.css'

// Placeholder visual — reemplazar por la regla de negocio real cuando se defina.
const AVATAR_COLORS = [
  { bg: '#7FA88A', text: '#F2F7F0' },
  { bg: '#C0392B', text: '#FBF7F2' },
  { bg: '#D9A441', text: '#4A3105' },
]

const getAvatarColors = (name = '') => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

const calculateAge = (dateOfBirth) => {
  const birth = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())
  if (!hasHadBirthdayThisYear) age--
  return age
}

const PatientListItem = ({ patient, onSelectPatient }) => {
  const fullName = `${patient.firstName} ${patient.lastName}`
  const initial = patient.firstName?.charAt(0).toUpperCase()
  const avatarColors = getAvatarColors(fullName)
  const age = calculateAge(patient.dateOfBirth)

  return (
    <div className={styles.patientlistitem}
      onClick={() => onSelectPatient(patient)}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.avatar} style={{ background: avatarColors.bg, color: avatarColors.text }}>
        {initial}
      </div>
      <div className={styles.textBlock}>
        <p className={styles.name}>{fullName}</p>
        <p className={styles.details}>{age} años - {patient.dni}</p>
      </div>
    </div>
  )
}

export default PatientListItem