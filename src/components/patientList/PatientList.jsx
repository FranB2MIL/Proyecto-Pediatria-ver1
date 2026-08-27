import { useState, useEffect } from 'react'
import styles from './PatientList.module.css'
import PatientListItem from '../patientItem/PatientListItem'
import { getAllPatients } from '../../services/patientService'
import CreateModal from '../../modal/CreatePacientModal';



const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)



  useEffect(() => {
    async function fetchPatients() {
      try {
        const data = await getAllPatients()
        setPatients(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])


  const handleAddPatient = (patientData) => {
    const token = localStorage.getItem('token'); 

    fetch(`http://localhost:5072/api/patient`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
            FirstName: patientData.firstName,      
            LastName: patientData.lastName,
            DateOfBirth: patientData.dateOfBirth,   
            DNI: patientData.dni,
            HealthInsurance: patientData.healthInsurance
        })
    })
    .then(res => {
        if (res.ok) {
            return res.json();
        }
        throw new Error("Error al crear el paciente");
    })
    .then(newPatient => {
        setPatients((prevPatients) => [...prevPatients, newPatient]);
    })
    .catch((err) => {
        console.error("Error", err);
    });
  }


  

  return (
    <div className={styles.patientlist}>

      <div className={styles.searchContainer}>
        <input type="text" placeholder="Buscar paciente..." className={styles.searchInput} />
        <button onClick={() => setIsModalOpen(true)} className={styles.primaryBtn}>Agregar Paciente</button>
      </div>

      {isModalOpen && (
        <CreateModal
          modalTitle="Agregar Paciente"
          onClose={() => setIsModalOpen(false)}
          onSave={(patientData) => {
            handleAddPatient(patientData)
            setIsModalOpen(false)
          }}
        />
      )}

      <div className={styles.listContainer}>
        {loading && <p>Cargando pacientes...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && patients.map((paciente) => (
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

export default PatientList;