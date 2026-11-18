import { useState } from 'react'
import { PERSONAL_FIELDS, initialAccountForm, validateAccountForm } from '../pages/registerHelper'
import styles from './CreateDoctorModal.module.css'

const FIELDS = [
  { key: 'firstName', label: 'Nombre', type: 'text' },
  { key: 'lastName', label: 'Apellido', type: 'text' },
  ...PERSONAL_FIELDS,
  { key: 'email', label: 'Correo Electrónico', type: 'email' },
  { key: 'password', label: 'Contraseña inicial', type: 'password' },
]

export default function CreateDoctorModal({ onClose, onSave }) {
  const [formData, setFormData] = useState(initialAccountForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateAccountForm(formData)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setError(null)
    setSubmitting(true)

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(err.message || 'Error al crear el médico')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} >
        <h3 className={styles.title}>Agregar Médico</h3>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {FIELDS.map(({ key, label, type }) => (
            <div key={key} className={styles.field}>
              <label htmlFor={key}>{label}</label>
              <input
                id={key}
                type={type}
                name={key}
                className={fieldErrors[key] ? styles.inputError : undefined}
                value={formData[key]}
                onChange={handleChange}
              />
              {fieldErrors[key] && <span className={styles.fieldError}>{fieldErrors[key]}</span>}
            </div>
          ))}

          {/* Junto a los botones: el formulario scrollea y arriba quedaría fuera de vista */}
          {error && <p className={styles.errorMsg}>{error}</p>}

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
              {submitting ? 'Guardando...' : 'Crear Médico'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
