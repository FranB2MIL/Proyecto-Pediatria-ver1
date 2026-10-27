import { useState } from 'react';
import { getAvatarVariant } from '../../utils/patientFormat';
import EditDoctorModal from '../../modal/EditDoctorModal';
import AssignPatientModal from '../../modal/AssignPatientModal';
import styles from './DoctorCard.module.css';

const AVATAR_CLASSES = {
  green: styles.avatarGreen,
  red: styles.avatarRed,
  amber: styles.avatarAmber,
};


const DoctorCard = ({
  id,
  firstName,
  lastName,
  email,
  onUpdateDoctor,
  allPatients = [],
  onAssignPatient,
  onRemovePatient,
}) => {

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [actionError, setActionError] = useState(null);

  const fullName = `${firstName} ${lastName}`;
  const initial = firstName?.charAt(0).toUpperCase();
  const avatarClass = AVATAR_CLASSES[getAvatarVariant(fullName)];

  const facts = [
    { label: 'Correo', value: email },
    { label: 'Rol', value: 'Médico' },
  ];

  
  const assignedPatients = allPatients.filter((p) =>
    p.doctors?.some((doc) => doc.id === id)
  );


  const availablePatients = allPatients.filter(
    (p) => !p.doctors?.some((doc) => doc.id === id)
  );

  const handleEdit = async (formData) => {
    try {
      setActionError(null);
      await onUpdateDoctor(id, formData);
      setIsEditModalOpen(false);
    } catch (err) {
      setActionError(`No se pudo actualizar: ${err.message}`);
    }
  };

  const handleRemove = async (patientId) => {
    try {
      setActionError(null);
      await onRemovePatient(id, patientId);
    } catch (err) {
      setActionError(`No se pudo quitar la asignación: ${err.message}`);
    }
  };

  const handleAssign = async (patientId) => {
    await onAssignPatient(id, patientId);
  };

  return (
    <div className={styles.doctorCard}>
      <section className={styles.header}>
        <div className={styles.identity}>
          <div className={`${styles.avatar} ${avatarClass}`} aria-hidden="true">
            {initial}
          </div>
          <div className={styles.identityText}>
            <h1 className={styles.name}>{fullName}</h1>
            <dl className={styles.facts}>
              {facts.map((fact) => (
                <div key={fact.label} className={styles.fact}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className={styles.secondaryBtn}
          >
            Editar datos
          </button>
        </div>
      </section>

      {actionError && (
        <p className={styles.actionError} role="alert">
          {actionError}
        </p>
      )}

      
      <section className={styles.assignmentsSection}>
        <div className={styles.assignmentsHeader}>
          <h2 className={styles.assignmentsTitle}>
            Pacientes Asignados ({assignedPatients.length})
          </h2>
          <button
            type="button"
            className={styles.assignBtn}
            onClick={() => setIsAssignModalOpen(true)}
          >
            + Asignar Paciente
          </button>
        </div>

        {assignedPatients.length === 0 ? (
          <p className={styles.emptyText}>
            Este doctor no tiene pacientes asignados actualmente.
          </p>
        ) : (
          <ul className={styles.patientList}>
            {assignedPatients.map((patient) => (
              <li key={patient.id} className={styles.patientItem}>
                <div className={styles.patientInfo}>
                  <span className={styles.patientName}>
                    {patient.firstName} {patient.lastName}
                  </span>
                  <span className={styles.patientDetails}>
                    DNI: {patient.dni || 'S/D'} • Tel: {patient.phoneNumber || 'S/T'}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemove(patient.id)} 
                  title="Quitar asignación"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

    
      {isEditModalOpen && (
        <EditDoctorModal
          doctor={{ id, firstName, lastName, email }}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEdit}
        />
      )}

      {isAssignModalOpen && (
        <AssignPatientModal
          availablePatients={availablePatients}
          onClose={() => setIsAssignModalOpen(false)}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
};

export default DoctorCard;