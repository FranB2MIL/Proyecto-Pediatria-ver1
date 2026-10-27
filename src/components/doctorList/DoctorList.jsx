import { useState, useEffect } from 'react';
import { getAllDoctors, createDoctor } from '../../services/doctorService';
import { normalize } from '../../utils/text';
import styles from './DoctorList.module.css';
import DoctorListItem from '../doctorListItem/DoctorListItem';
import CreateDoctorModal from '../../modal/CreateDoctorModal';

export default function DoctorList({ onSelectDoctor, updatedDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllDoctors();
      setDoctors(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);



  useEffect(() => {
    if (!updatedDoctor) return;

    setDoctors((prevDoctors) =>
      prevDoctors.map((doc) =>
        doc.id === updatedDoctor.id ? { ...doc, ...updatedDoctor } : doc
      )
    );
  }, [updatedDoctor]);

  

  const handleCreateDoctor = async (formData) => {
    await createDoctor(formData)
    await loadDoctors()
  }

  const term = normalize(query.trim());
  const filteredDoctors = (doctors || []).filter((doc) => {
    if (!term) return true;
    const fullName = normalize(`${doc.firstName} ${doc.lastName}`);
    const email = normalize(doc.email || '');
    return fullName.includes(term) || email.includes(term);
  });

  return (
    <div className={styles.doctorList}>
      <input
        type="text"
        placeholder="Buscar doctor..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />


      <button
        type="button"
        className={styles.addButton}
        onClick={() => setIsModalOpen(true)}
      >
        Agregar Doctor
      </button>

  
      {isModalOpen && (
        <CreateDoctorModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateDoctor}
        />
      )}

      {loading && <p>Cargando doctores...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        filteredDoctors.length === 0 ? (
          <p>No se encontraron doctores.</p>
        ) : (
          <ul className={styles.doctorListItems}>
            {filteredDoctors.map((doctor) => (
              <DoctorListItem
                key={doctor.id}
                doctor={doctor}
                onSelect={onSelectDoctor}
              />
            ))}
          </ul>
        )
      )}
    </div>
  );
}