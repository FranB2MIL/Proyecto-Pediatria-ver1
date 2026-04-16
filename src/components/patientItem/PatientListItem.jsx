import styles from './PatientListItem.module.css'
import { PATIENTS } from '../../data'


const PatientListItem = ({ patient, onSelectPatient }) => {
  return (
    <div className={styles.patientlistitem}
      onClick={() => onSelectPatient(patient)}
      style={{ cursor: 'pointer' }}
    >
      <p>{patient.nombre}</p>
      <p>{patient.edad} años - {patient.sexo} - {patient.dni}</p>
    </div>
  )
}

export default PatientListItem