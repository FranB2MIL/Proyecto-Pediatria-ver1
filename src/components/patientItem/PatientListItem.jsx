import styles from './PatientListItem.module.css'

const PatientListItem = ({ nombre, edad, sexo, dni }) => {
  return (
    <div className={styles.patientlistitem}>
      <p>{nombre}</p>
      <p>{edad} años - {sexo} - {dni}</p>
    </div>
  )
}

export default PatientListItem