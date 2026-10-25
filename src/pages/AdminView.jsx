import {useNavigate} from "react-router-dom";
import styles from './AdminView.module.css';

function AdminView() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('staffToken');
        navigate('/staff/login');
    }

    return(
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div>
                        <span className={styles.brand}>MediTrack</span>
                    </div>
                    <button className={styles.logoutButton} onClick={handleLogout}>Cerrar sesión</button>
                </div>
                
            </header>
            
        </div>
    )
}

export default AdminView;

