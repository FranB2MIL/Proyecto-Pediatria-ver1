import styles from './PatientList.module.css'
import PatientListItem from '../patientItem/PatientListItem'
import { PATIENTS } from '../../data'

const PatientList = ({onSelectPatient}) => {
  
  return (  
    <div className={styles.patientlist}>  
    
      {PATIENTS.map((paciente) => (
        <PatientListItem 
          key={paciente.id}
          patient={paciente}
          onSelectPatient={onSelectPatient}
        />
      ))}
    </div>
  )
}

export default PatientList
