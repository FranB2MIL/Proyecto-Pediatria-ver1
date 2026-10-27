import { useMemo, useState } from 'react'
import DoctorSelect from '../doctorSelect/DoctorSelect'
import HistoryListItem from '../historyListItem/HistoryListItem'
import CreateConsultationModal from '../../modal/CreateConsultationModal'
import ConfirmModal from '../../modal/ConfirmModal'
import styles from './HistoryList.module.css'
import { toFormMeasurement } from '../../utils/measurement'
import { heightInCm, headCircumferenceInCm } from '../../utils/measurement'

const HistoryList = ({ consultations, loading, error, onEditConsultation, onDeleteConsultation, showDoctor = false, filterByDoctor = false }) => {
  const [editingConsultation, setEditingConsultation] = useState(null)
  const [deletingConsultation, setDeletingConsultation] = useState(null)
  const [actionError, setActionError] = useState(null)
  // null o '' = sin filtro ("Seleccionar doctor"); otro valor = id del doctor
  const [selectedDoctorId, setSelectedDoctorId] = useState(null)

  // Doctores únicos sacados de las consultas (ya vienen con doctorId y doctorName)
  const doctors = useMemo(() => {
    if (!filterByDoctor) return []
    const byId = new Map()
    consultations.forEach(c => {
      if (c.doctorId != null && !byId.has(c.doctorId)) {
        byId.set(c.doctorId, { id: c.doctorId, firstName: c.doctorName })
      }
    })
    return [...byId.values()]
  }, [consultations, filterByDoctor])

  const visibleConsultations = selectedDoctorId
    ? consultations.filter(c => String(c.doctorId) === selectedDoctorId)
    : consultations

  const handleEditConsultation = async (consultationId, formData) => {
    try {
      setActionError(null)
      await onEditConsultation(consultationId, formData)
    } catch (err) {
      setActionError(`No se pudo guardar la consulta: ${err.message}`)
    }
  }

  const handleDeleteConsultation = async (consultationId) => {
    try {
      setActionError(null)
      await onDeleteConsultation(consultationId)
    } catch (err) {
      setActionError(`No se pudo eliminar la consulta: ${err.message}`)
    }
  }

  const hasConsultations = !loading && !error && visibleConsultations.length > 0
  const showFilter = filterByDoctor && !loading && !error
  // Con al menos 1 doctor se puede elegir; con 0 la caja dice "Sin doctores"
  const canFilter = doctors.length >= 1
  const latestId = consultations[0]?.id
  // Sin callbacks (vista del paciente) la tabla es solo lectura
  const readOnly = !onEditConsultation && !onDeleteConsultation

  return (
    <section className={`${styles.historylist} ${showFilter ? styles.withFilter : ''}`}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>Historial de consultas</h2>
          {hasConsultations && (
            <span className={styles.count}>
              {visibleConsultations.length === 1 ? '1 consulta' : `${visibleConsultations.length} consultas`}
            </span>
          )}
        </div>
        {showFilter && (
          <div className={styles.filter}>
            <DoctorSelect
              doctors={doctors}
              selectedId={selectedDoctorId}
              onChange={setSelectedDoctorId}
              placeholder={canFilter ? 'Seleccionar doctor' : 'Sin doctores'}
              allLabel={canFilter ? 'Seleccionar doctor' : undefined}
            />
          </div>
        )}
      </div>
      {actionError && <p className={styles.actionError} role="alert">{actionError}</p>}
      {loading && <p className={styles.stateMessage}>Cargando historial...</p>}
      {!loading && error && <p className={styles.stateMessage}>Error: {error}</p>}
      {!loading && !error && consultations.length === 0 && (
        <p className={styles.stateMessage}>Todavía no hay consultas registradas.</p>
      )}
      {!loading && !error && consultations.length > 0 && visibleConsultations.length === 0 && (
        <p className={styles.stateMessage}>No hay consultas de este doctor</p>
      )}
      {hasConsultations && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Motivo</th>
                <th scope="col" className={styles.num}>Peso</th>
                <th scope="col" className={styles.num}>Talla</th>
                <th scope="col" className={styles.num}>P. cefálico</th>
                <th scope="col" className={styles.num}>IMC</th>
                {!readOnly && <th scope="col"><span className={styles.srOnly}>Acciones</span></th>}
              </tr>
            </thead>
            <tbody>
              {visibleConsultations.map((c) => (
                <HistoryListItem
                  key={c.id}
                  id={c.id}
                  reason={c.reason}
                  date={c.date}
                  description={c.description}
                  doctorName={showDoctor ? c.doctorName : undefined}
                  weight={c.measurement?.weight}
                  height={heightInCm(c.measurement)}
                  size={headCircumferenceInCm(c.measurement)}
                  imc={c.measurement?.imc}
                  isLatest={c.id === latestId}

                  onEdit={onEditConsultation && (() => setEditingConsultation(c))}
                  onDelete={onDeleteConsultation && ((id) => setDeletingConsultation(id))}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingConsultation && (
        <CreateConsultationModal
          modalTitle="Editar Consulta"
          initialData={{
            date: editingConsultation.date?.slice(0, 10) ?? '',
            reason: editingConsultation.reason ?? '',
            description: editingConsultation.description ?? '',
            measurement: toFormMeasurement(editingConsultation.measurement),
          }}
          onClose={() => setEditingConsultation(null)}
          onSave={(formData) => {
            handleEditConsultation(editingConsultation.id, formData)
            setEditingConsultation(null)
          }}
        />
      )}

      {deletingConsultation && (
        <ConfirmModal
          message="¿Estás seguro que querés eliminar esta consulta?"
          onConfirm={() => {
            handleDeleteConsultation(deletingConsultation)
            setDeletingConsultation(null)
          }}
          onClose={() => setDeletingConsultation(null)}
        />
      )}
    </section>
  )
}

export default HistoryList