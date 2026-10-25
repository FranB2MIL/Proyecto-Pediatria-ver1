import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { toProfileForm, validateProfileForm, toProfilePayload } from './editProfileModalHelper.js'
import { getErrorMessage } from '../utils/errorMessages'
import styles from './EditProfileModal.module.css'

const FIELDS = [
  { key: 'firstName', label: 'Nombre', type: 'text', autoComplete: 'given-name', required: true },
  { key: 'lastName', label: 'Apellido', type: 'text', autoComplete: 'family-name', required: true },
  { key: 'dni', label: 'DNI', type: 'text', readOnly: true },
  { key: 'dateOfBirth', label: 'Fecha de nacimiento', type: 'date', required: true },
  { key: 'healthInsurance', label: 'Obra social', type: 'text' },
  { key: 'insuranceNumber', label: 'N.º de afiliado', type: 'text' },
  { key: 'email', label: 'Email', type: 'email', readOnly: true },
  { key: 'phoneNumber', label: 'Teléfono', type: 'tel', autoComplete: 'tel', required: true },
]

// onSave recibe los datos ya validados y devuelve una promesa: si falla, el modal
// queda abierto y muestra el error; si sale bien, el que lo abrió decide cerrarlo.
const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = useState(() => toProfileForm(profile))
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleInputChange = (event, inputKey) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [inputKey]: event.target.value,
    }))
    // El error de un campo se va apenas el usuario lo corrige
    setErrors(prevErrors => {
      if (!prevErrors[inputKey]) return prevErrors
      const { [inputKey]: _removed, ...rest } = prevErrors
      return rest
    })
  }

  const handleClose = () => {
    if (!saving) onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateProfileForm(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSaving(true)
    setSubmitError(null)
    try {
      await onSave(toProfilePayload(formData))
    } catch (err) {
      // El back valida con DataAnnotations: un 400 sin { message } llega como "Error 400"
      setSubmitError(err.status === 400 && err.message === 'Error 400' ? 'Revisá los datos ingresados' : getErrorMessage(err))
      setSaving(false)
    }
  }

  return (
    <Modal show={true} onHide={handleClose} centered>
      <Modal.Header closeButton={!saving}>
        <Modal.Title className={styles.modalTitle}>Editar mis datos</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {submitError && (
          <p className={styles.errorMessage} role="alert">No pudimos guardar tus datos: {submitError}</p>
        )}
        <form onSubmit={handleSubmit} id="edit-profile-form" className={styles.form} noValidate>
          {FIELDS.map(field => {
            const inputId = `profile-${field.key}`
            const errorId = `${inputId}-error`
            const hasError = Boolean(errors[field.key])
            return (
              <div key={field.key} className={styles.field}>
                <label className={styles.label} htmlFor={inputId}>
                  {field.label}
                  {!field.required && !field.readOnly && <span className={styles.optional}> (opcional)</span>}
                </label>
                <input
                  id={inputId}
                  className={`${styles.input} ${hasError ? styles.inputError : ''}`}
                  type={field.type}
                  inputMode={field.inputMode}
                  autoComplete={field.autoComplete}
                  value={formData[field.key]}
                  onChange={(event) => handleInputChange(event, field.key)}
                  disabled={saving || field.readOnly}
                  aria-invalid={hasError}
                  aria-describedby={hasError ? errorId : undefined}
                />
                {hasError && <span id={errorId} className={styles.fieldError}>{errors[field.key]}</span>}
              </div>
            )
          })}
          <p className={styles.readOnlyNote}>Para cambiar el DNI o el email contactá a tu doctor/clínica.</p>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button type="button" className={styles.secondaryBtn} onClick={handleClose} disabled={saving}>
          Cancelar
        </button>
        <button type="submit" form="edit-profile-form" className={styles.primaryBtn} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditProfileModal
