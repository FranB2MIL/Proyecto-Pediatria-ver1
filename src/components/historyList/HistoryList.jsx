import { useState } from 'react'
import HistoryListItem from '../historyListItem/HistoryListItem'
import CreateConsultationModal from '../../modal/CreateConsultationModal'
import ConfirmModal from '../../modal/ConfirmModal'
import styles from './HistoryList.module.css'

const HistoryList = ({ consultations, loading, error, onEditConsultation, onDeleteConsultation }) => {
  const [editingConsultation, setEditingConsultation] = useState(null)
  const [deletingConsultation, setDeletingConsultation] = useState(null)
  const [actionError, setActionError] = useState(null)

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

  const hasConsultations = !loading && !error && consultations.length > 0

  return (
    <section className={styles.historylist}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Historial de consultas</h2>
        {hasConsultations && (
          <span className={styles.count}>
            {consultations.length === 1 ? '1 consulta' : `${consultations.length} consultas`}
          </span>
        )}
      </div>
      {actionError && <p className={styles.actionError} role="alert">{actionError}</p>}
      {loading && <p className={styles.stateMessage}>Cargando historial...</p>}
      {!loading && error && <p className={styles.stateMessage}>Error: {error}</p>}
      {!loading && !error && consultations.length === 0 && (
        <p className={styles.stateMessage}>Este paciente todavía no tiene consultas.</p>
      )}
      {hasConsultations && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col">Motivo</th>
                <th scope="col" className={styles.num}>Peso</th>
                <th scope="col" className={styles.num}>Altura</th>
                <th scope="col" className={styles.num}>Talla</th>
                <th scope="col" className={styles.num}>IMC</th>
                <th scope="col"><span className={styles.srOnly}>Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((c, index) => (
                <HistoryListItem
                  key={c.id}
                  id={c.id}
                  reason={c.reason}
                  date={c.date}
                  description={c.description}
                  weight={c.measurement?.weight}
                  height={c.measurement?.height}
                  size={c.measurement?.size}
                  imc={c.measurement?.imc}
                  isLatest={index === 0}
                  onEdit={(consultationData) => setEditingConsultation(consultationData)}
                  onDelete={(id) => setDeletingConsultation(id)}
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
            measurement: {
              weight: editingConsultation.measurement?.weight ?? 0,
              height: editingConsultation.measurement?.height ?? 0,
              size: editingConsultation.measurement?.size ?? 0,
            },
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