import styles from './PatientCard.module.css'

const PatientCard = () => {
  return (
    <div className={styles.patientcard}>
      <h2>Paciente 1</h2>
      <p>Edad: 5 años</p>
      <p>Diagnóstico: Resfriado común</p>
      <p>Tratamiento: Descanso, líquidos y medicamentos para aliviar los síntomas</p>
    </div>
  )
}

export default PatientCard 

