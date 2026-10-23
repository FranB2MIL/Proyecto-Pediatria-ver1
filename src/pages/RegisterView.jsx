import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerPatient } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import { initialRegisterForm, validateRegisterForm } from './registerHelper'
import styles from './AuthForm.module.css'

const FIELDS = [
  { key: 'firstName', label: 'Nombre', type: 'text' },
  { key: 'lastName', label: 'Apellido', type: 'text' },
  { key: 'dni', label: 'DNI', type: 'text' },
  { key: 'dateOfBirth', label: 'Fecha de nacimiento', type: 'date' },
  { key: 'healthInsurance', label: 'Obra social (opcional)', type: 'text' },
  { key: 'insuranceNumber', label: 'N° de afiliado (opcional)', type: 'text' },
  { key: 'phoneNumber', label: 'Teléfono', type: 'tel' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'password', label: 'Contraseña', type: 'password' },
  { key: 'confirmPassword', label: 'Repetir contraseña', type: 'password' },
]

function RegisterView() {
    const [formData, setFormData] = useState(initialRegisterForm)
    const [fieldErrors, setFieldErrors] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const { handleUserLogin } = useAuth()
    const navigate = useNavigate()

    const handleInputChange = (event, inputKey) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [inputKey]: event.target.value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
    
        const errors = validateRegisterForm(formData)
        setFieldErrors(errors)
        if (Object.keys(errors).length > 0) return

        setError(null)
        setLoading(true)

        try {
            const response = await registerPatient(formData)
            handleUserLogin(response)
            navigate('/mi-ficha')
          } catch (err) {
            setError(err.message)
          } finally {
            setLoading(false)
          }
         }

         return (
            <div className={styles.page}>
                <h2 className={styles.brand}>MediTrack</h2>

                <div className={`${styles.card} ${styles.cardWide}`}>
                    <h1 className={styles.title}>Crear cuenta</h1>
                    <p className={styles.subtitle}>Registrate como paciente</p>

                    <form onSubmit={handleSubmit} className={styles.form} noValidate>
                        {FIELDS.map(({ key, label, type}) => (
                            <div key={key} className={styles.field}>
                                <label htmlFor={key} className={styles.label}>{label}</label>
                                <input
                                    id={key}
                                    type={type}
                                    className={`${styles.input} ${fieldErrors[key] ? styles.inputError : ''}`}
                                        value={formData[key]}
                                        onChange={(event) => handleInputChange(event, key)}
                                />
                                {fieldErrors[key] && <span className={styles.fieldError}>{fieldErrors[key]}</span>}
                            </div>
                        ))}

                     {error && <p className={styles.formError}>{error}</p>}

                     <button type="submit" className={styles.primaryBtn} disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Registrarme'}
                    </button>
                   </form>

                    <p className={styles.footer}>
                        ¿Ya tenés cuenta? <Link to="/login" className={styles.link}>Iniciá sesión</Link>
                    </p>
                </div>
               </div>
        )
    }
    
export default RegisterView