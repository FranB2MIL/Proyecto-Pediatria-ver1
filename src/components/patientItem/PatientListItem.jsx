import styles from './PatientListItem.module.css'
import { PATIENTS } from '../../data'

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

const PatientListItem = ({ patient, onSelectPatient }) => {
  const initial = patient.nombre?.charAt(0).toUpperCase()
  const avatarColors = getAvatarColors(patient.nombre)

  return (
    <div className={styles.patientlistitem}
      onClick={() => onSelectPatient(patient)}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.avatar} style={{ background: avatarColors.bg, color: avatarColors.text }}>
        {initial}
      </div>
      <div className={styles.textBlock}>
        <p className={styles.name}>{patient.nombre}</p>
        <p className={styles.details}>{patient.edad} años - {patient.sexo} - {patient.dni}</p>
      </div>
    </div>
  )
}

export default PatientListItem