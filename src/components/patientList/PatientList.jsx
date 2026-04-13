import styles from './PatientList.module.css'
import PatientListItem from '../patientItem/PatientListItem'
import { PATIENTS } from '../../data'

const PatientList = () => {
  
  return (  
    <div className={styles.patientlist}>  
    
      {PATIENTS.map((paciente) => (
        <PatientListItem 
          key={paciente.id}
          nombre={paciente.nombre}
          edad={paciente.edad}
          sexo={paciente.sexo}
          dni={paciente.dni}
        />
      ))}
    </div>
  )
}

export default PatientList