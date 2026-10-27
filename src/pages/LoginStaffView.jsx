import {useState} from "react";
import {loginStaff} from "../services/authService";
import { Link, useNavigate } from 'react-router-dom'
import styles from './LoginStaffView.module.css';
import {HOME_BY_ROLE} from "../utils/roles";
import { useAuth } from '../hooks/useAuth'


function LoginStaffView() {
    const [formData, setFormData] = useState({email: '', password: ''});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { handleUserLogin } = useAuth()
    
    const handleInputChange = (event, inputKey) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [inputKey]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
  event.preventDefault()

  if (!formData.email.trim() || !formData.password) {
    setError('Completá el email y la contraseña')
    return
  }

  setError(null)
  setLoading(true)

  try {
    const response = await loginStaff(formData.email.trim(), formData.password)
    const destination = HOME_BY_ROLE[response.role]

    if (!destination) {
      setError('Esta cuenta no tiene acceso al sistema de personal.')
      return
    }

    handleUserLogin(response)
    navigate(destination)
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
                    <h1 className={styles.title}>Acceso Staff</h1>
                    <p className={styles.subtitle}>Portal para médicos y administradores</p>


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

                        {error && <p className={styles.error}>{error}</p>}

                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'ingresando...' : 'Iniciar sesión'}
                        </button>
                        <p className={styles.footer}>¿Sos paciente? <Link to="/login" className={styles.link}>Incia sesion aqui.</Link></p>
                    </form>
                </div>
            </div>

            
        );
    }

export default LoginStaffView;