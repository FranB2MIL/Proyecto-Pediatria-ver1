import styles from './PatientListItem.module.css'
import { PATIENTS } from '../../data'


const PatientListItem = ({ patient, onSelectPatient }) => {
  return (
    <div className={styles.patientlistitem}
      onClick={() => onSelectPatient(patient)}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.avatar} />
      <div className={styles.textBlock}>
        <p className={styles.name}>{patient.nombre}</p>
        <p className={styles.details}>{patient.edad} años - {patient.sexo} - {patient.dni}</p>
      </div>
    </div>
  )
}

export default PatientListItem