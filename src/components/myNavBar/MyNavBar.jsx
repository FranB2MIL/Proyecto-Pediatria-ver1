import React from 'react';
import { useNavigate } from 'react-router-dom'

const MyNavBar = () => {
    const navigate = useNavigate()
    return (
        <div style={{ height: '100px', background: '#C0392B' }}>
            Navbar
            <nav>
                <button onClick={() => navigate('/')}>Mis pacientes</button>
                <button onClick={() => navigate('/turnos')}>Mis turnos</button>
            </nav>
        </div>
    );
};

export default MyNavBar;