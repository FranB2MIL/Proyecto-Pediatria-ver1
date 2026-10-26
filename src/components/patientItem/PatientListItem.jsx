import { getAvatarColors, calculateAge } from '../../utils/patientFormat'
import styles from './PatientListItem.module.css'

const PatientListItem = ({ patient, onSelectPatient, isSelected }) => {
  const fullName = `${patient.firstName} ${patient.lastName}`
  const initial = patient.firstName?.charAt(0).toUpperCase()
  const avatarColors = getAvatarColors(fullName)
  const age = calculateAge(patient.dateOfBirth)

  return (
    <div className={styles.patientlistitem}
      onClick={() => onSelectPatient(patient)}
      aria-current={isSelected ? 'true' : undefined}
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