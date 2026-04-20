import styles from './PatientList.module.css'
import PatientListItem from '../patientItem/PatientListItem'
import { PATIENTS } from '../../data'

const PatientList = ({ onSelectPatient }) => {

  return (
    <div className={styles.patientlist}>

      <div className={styles.searchContainer}>
        <input type="text" placeholder="Buscar paciente..." className={styles.searchInput} />
      </div>
      
      <div className={styles.listContainer}>
        {PATIENTS.map((paciente) => (
          <PatientListItem
            key={paciente.id}
            patient={paciente}
            onSelectPatient={onSelectPatient}
          />
        ))}
      </div>

    </div>
  )
}

export default PatientList
