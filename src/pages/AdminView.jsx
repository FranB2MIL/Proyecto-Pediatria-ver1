import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminView.module.css';
import DoctorList from '../components/doctorList/DoctorList';
import DoctorCard from '../components/doctorCard/DoctorCard';
import { updateDoctor } from '../services/doctorService';
import { 
  getAdminPatients, 
  assignPatientToDoctor, 
  removePatientFromDoctor 
} from '../services/adminService';

function AdminView() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [updatedDoctor, setUpdatedDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  const loadPatients = async () => {
    try {
      const data = await getAdminPatients();
      setPatients(data || []);
    } catch (err) {
      console.error('Error al cargar pacientes admin:', err);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleUpdateDoctor = async (id, formData) => {
    const updated = await updateDoctor(id, formData);
    const fullUpdatedDoctor = {
      ...selectedDoctor,
      ...formData,
      ...(updated || {}),
    };
    setSelectedDoctor(fullUpdatedDoctor);
    setUpdatedDoctor(fullUpdatedDoctor);
  };

 
  const handleAssignPatient = async (doctorId, patientId) => {
    await assignPatientToDoctor(doctorId, patientId);
    await loadPatients(); 
  };

  
  const handleRemovePatient = async (doctorId, patientId) => {
    await removePatientFromDoctor(doctorId, patientId);
    await loadPatients(); 
  };

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    navigate('/staff/login');
  };

  return (
    <div className={styles.pageContainer}>
      <DoctorList 
        onSelectDoctor={handleSelectDoctor} 
        updatedDoctor={updatedDoctor} 
      />

      <div className={styles.infoColumn}>
        {selectedDoctor ? (
          <div className={styles.cardSection}>
            <DoctorCard
              {...selectedDoctor}
              onUpdateDoctor={handleUpdateDoctor}
              allPatients={patients}
              onAssignPatient={handleAssignPatient}
              onRemovePatient={handleRemovePatient}
            />
          </div>
        ) : (
          <p style={{ color: '#6e655d', margin: 'auto' }}>
            Seleccioná un doctor de la lista para ver su información
          </p>
        )}
      </div>

      <button onClick={handleLogout} className={styles.logoutButton}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default AdminView;