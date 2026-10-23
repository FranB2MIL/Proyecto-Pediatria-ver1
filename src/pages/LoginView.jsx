import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginPatient } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import styles from './AuthForm.module.css'

function LoginView() {
    const [formData, setFormData] = useState({ email: '', password: '' })
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

        if (!formData.email.trim() || !formData.password) {
            setError('Complete el email y la contraseña')
            return
        }

        setError(null)
        setLoading(true)

        try {
            const response = await loginPatient(formData.email.trim(),formData.password)
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
                <div className={styles.card}>
                    <h1 className={styles.title}>Iniciar sesión</h1>
                    <p className={styles.subtitle}>Ingresá con tu cuenta de paciente</p>

                    <form onSubmit={handleSubmit} className={styles.form} noValidate>
                        <div className={styles.field}>
                            <label htmlFor="email" className={styles.label}>Email</label>
                            <input
                            id="email"
                            type="email"
                            className={styles.input}
                            value={formData.email}
                            onChange={(event) => handleInputChange(event, 'email')}
                           />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password" className={styles.label}>Contraseña</label>
                            <input
                            id="password"
                            type="password"
                            className={styles.input}
                            value={formData.password}
                            onChange={(event) => handleInputChange(event, 'password')}
                           />
                        </div>

                        {error && <p className={styles.formError}>{error}</p>}

                        <button type="submit" className={styles.primaryBtn} disabled={loading}>
                          {loading ? 'Ingresando...' : 'Iniciar sesión'}
                        </button>
                    </form>
                    <p className={styles.footer}>
                        ¿No tenés cuenta? <Link to="/register" className={styles.link}>Registrate</Link>
                    </p>
                </div>
            </div>
        )
    }

export default LoginView
        


