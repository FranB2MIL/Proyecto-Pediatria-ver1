import React from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './MyNavBar.module.css'

const MyNavBar = () => {
    const navigate = useNavigate()
    return (
        <nav className={styles.navbar}>
            <button className={styles.navButtonPrimary} onClick={() => navigate('/')}>Mis pacientes</button>
            <a href="/" className={styles.brand} aria-label="MediTrack, ir al inicio">
                Medi<span className={styles.brandAccent}>Track</span>
            </a>
            <button className={styles.navButtonSecondary} onClick={() => navigate('/turnos')}>Mis turnos</button>
        </nav>
    );
};

export default MyNavBar;