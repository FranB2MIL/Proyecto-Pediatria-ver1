import { useState, useEffect } from 'react'
import HistoryListItem from "../historyListItem/HistoryListItem"
import CreateConsultationModal from '../../modal/CreateConsultationModal'
import ConfirmModal from '../../modal/ConfirmModal'
import { getConsultationsByPatientId, updateConsultation, deleteConsultation } from '../../services/consultationService'
import styles from './HistoryList.module.css'

const HistoryList = ({ id }) => {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingConsultation, setEditingConsultation] = useState(null)
  const [deletingConsultation, setDeletingConsultation] = useState(null)

  const handleEditClick = (consultationData) => {
    setEditingConsultation(consultationData)
  }

  const handleEditConsultation = async (consultationId, formData) => {
    try {
      const normalized = {
        date: formData.date,
        reason: formData.reason,
        description: formData.description,
        measurement: {
          weight: Number(formData.measurement.weight) || 0,
          height: Number(formData.measurement.height) || 0,
          size: Number(formData.measurement.size) || 0,
        },
      }
      await updateConsultation(consultationId, normalized)
      setConsultations(prev => prev.map(c => (c.id === consultationId ? { ...c, ...normalized } : c)))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteConsultation = async (consultationId) => {
    try {
      await deleteConsultation(consultationId)
      setConsultations(prev => prev.filter(c => c.id !== consultationId))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    async function fetchConsultations() {
      try {
        const data = await getConsultationsByPatientId(id)
        setConsultations(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [id])

  const sortedHistory = consultations
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className={styles.historylist}>
      <p className={styles.title}>Historial de consultas del paciente</p>
      <div className={styles.itemsContainer}>
        {loading && <p>Cargando historial...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && sortedHistory.map(c => (
          <HistoryListItem
            key={c.id}
            id={c.id}
            descripcion={c.reason}
            fechaCreacion={c.date}
            description={c.description}
            peso={c.measurement?.weight}
            altura={c.measurement?.height}
            talla={c.measurement?.size}
            imc={c.measurement?.imc}
            onEdit={handleEditClick}
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