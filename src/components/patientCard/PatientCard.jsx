import styles from './PatientCard.module.css'

const PatientCard = ({ nombre, apellido, dni, fechaNacimiento, obraSocial }) => {
  return (
    <div className={styles.patientcard}>
      <h2>{nombre} {apellido}</h2>
      <p>DNI: {dni}</p>
      <p>Fecha de nacimiento: {fechaNacimiento}</p>
      <p>Obra social: {obraSocial}</p>
      
    </div>
  )
}

export default PatientCard

