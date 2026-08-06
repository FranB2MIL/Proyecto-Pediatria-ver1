import React from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './MyNavBar.module.css'

const MyNavBar = () => {
    const navigate = useNavigate()
    return (
        <nav className={styles.navbar}>
            <button className={styles.navButton} onClick={() => navigate('/')}>Mis pacientes</button>
            <button className={styles.navButton} onClick={() => navigate('/turnos')}>Mis turnos</button>
        </nav>
    );
};

export default MyNavBar;