import styles from './PatientList.module.css'
import PatientListItem from '../patientItem/PatientListItem'

const PatientList = () => {
  return (
    <div className={styles.patientlist}>
      Lista
      <PatientListItem/>
    </div>
  )
}

export default PatientList