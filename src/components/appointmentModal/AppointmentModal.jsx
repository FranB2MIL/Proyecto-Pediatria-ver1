import { useState, useEffect } from 'react'
import { getAllPatients } from '../../services/patientService'
import { createAppointment, cancelAppointment } from '../../services/appointmentService'
import styles from './AppointmentModal.module.css'

function AppointmentModal({ slot, onClose, onSaved }) {
  const [patients, setPatients] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [errorPatients, setErrorPatients] = useState(null)

  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const isBooked = slot.status === 'Reservado'

  useEffect(() => {
    if (isBooked) return // no hace falta la lista de pacientes para cancelar

    async function loadPatients() {
      setLoadingPatients(true)
      setErrorPatients(null)
      try {
        const data = await getAllPatients()
        setPatients(data)
      } catch (err) {
        setErrorPatients(err.message)
      } finally {
        setLoadingPatients(false)
      }
    }

    loadPatients()
  }, [isBooked])

  async function handleCreate() {
    if (!selectedPatientId) return

    setSubmitting(true)
    setSubmitError(null)
    try {
      await createAppointment({
        date: slot.date,
        startTime: slot.startTime,
        availabilityId: slot.availabilityId,
        patientId: Number(selectedPatientId),
      })
      onSaved()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCancel() {
    setSubmitting(true)
    setSubmitError(null)
    try {
      await cancelAppointment(slot.appointment.id)
      onSaved()
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>
          {isBooked ? 'Turno reservado' : 'Nuevo turno'}
        </h2>

        <p className={styles.subtitle}>
          {slot.date} — {slot.startTime}
        </p>

        {isBooked ? (
          <>
            <p className={styles.patientName}>
              Paciente: {slot.appointment?.patientName ?? 'Sin datos'}
            </p>

            {submitError && <p className={styles.error}>{submitError}</p>}

            <div className={styles.actions}>
              <button className={styles.secondaryBtn} onClick={onClose}>
                Cerrar
              </button>
              <button
                className={styles.dangerBtn}
                onClick={handleCancel}
                disabled={submitting}
              >
                {submitting ? 'Cancelando...' : 'Cancelar turno'}
              </button>
            </div>
          </>
        ) : (
          <>
            {loadingPatients && <p>Cargando pacientes...</p>}
            {errorPatients && <p className={styles.error}>{errorPatients}</p>}

            {!loadingPatients && !errorPatients && (
              <select
                className={styles.select}
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
              >
                <option value="">Elegir paciente...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
            )}

            {submitError && <p className={styles.error}>{submitError}</p>}

            <div className={styles.actions}>
              <button className={styles.secondaryBtn} onClick={onClose}>
                Cancelar
              </button>
              <button
                className={styles.primaryBtn}
                onClick={handleCreate}
                disabled={submitting || !selectedPatientId}
              >
                {submitting ? 'Guardando...' : 'Confirmar turno'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AppointmentModal