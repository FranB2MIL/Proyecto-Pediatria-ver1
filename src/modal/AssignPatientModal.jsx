import { useState } from 'react';
import styles from './CreateDoctorModal.module.css';

export default function AssignPatientModal({ availablePatients = [], onClose, onAssign }) {
  const [selectedPatientId, setSelectedPatientId] = useState(
    availablePatients.length > 0 ? availablePatients[0].id : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    setError(null);
    setSubmitting(true);
    try {
      await onAssign(Number(selectedPatientId));
      onClose();
    } catch (err) {
      setError(err.message || 'Error al asignar el paciente');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* stopPropagation evita que se cierre si clickeás adentro del recuadro blanco */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Asignar Paciente</h3>

        {error && <p className={styles.errorMsg}>{error}</p>}

        {availablePatients.length === 0 ? (
          <div>
            <p style={{ color: '#6e655d', margin: '20px 0' }}>
              No hay pacientes disponibles para asignar a este médico.
            </p>
            <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="patientSelect">Seleccionar Paciente</label>
              <select
                id="patientSelect"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d4c7bd',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  backgroundColor: '#ffffff'
                }}
              >
                {availablePatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} (DNI: {p.dni || 'S/D'})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting}
              >
                {submitting ? 'Asignando...' : 'Asignar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}