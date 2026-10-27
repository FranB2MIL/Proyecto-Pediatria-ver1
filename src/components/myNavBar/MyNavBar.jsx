import React from 'react';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import UserMenu from '../userMenu/UserMenu'
import styles from './MyNavBar.module.css'

const MyNavBar = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    return (
        <nav className={styles.navbar}>
            <div className={styles.navGroup}>
                <button className={styles.navButtonPrimary} onClick={() => navigate('/')}>Mis pacientes</button>
                <button className={styles.navButtonSecondary} onClick={() => navigate('/turnos')}>Mis turnos</button>
            </div>
            <a href="/" className={styles.brand} aria-label="MediTrack, ir al inicio">
                Medi<span className={styles.brandAccent}>Track</span>
            </a>
            <div className={styles.userSlot}>
                <UserMenu name={user?.name} logoutPath="/staff/login" />
            </div>
        </nav>
    );
};

export default MyNavBar;