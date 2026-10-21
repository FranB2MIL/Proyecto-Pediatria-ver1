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

  return (
    <div className={styles.historylist}>
      <p className={styles.title}>Historial de consultas del paciente</p>
      {actionError && <p>{actionError}</p>}
      <div className={styles.itemsContainer}>
        {loading && <p>Cargando historial...</p>}
        {!loading && error && <p>Error: {error}</p>}
        {!loading && !error && consultations.length === 0 && (
          <p>Este paciente todavía no tiene consultas.</p>
        )}
        {!loading && !error && consultations.map(c => (
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
            onEdit={(consultationData) => setEditingConsultation(consultationData)}
            onDelete={(id) => setDeletingConsultation(id)}
          />
        ))}
      </div>

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
    </div>
  )
}

export default HistoryList