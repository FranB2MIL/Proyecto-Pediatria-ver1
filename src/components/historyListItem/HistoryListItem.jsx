import React from 'react';

const HistoryListItem = ({ id,descripcion, fechaCreacion, peso, altura, talla, percentiloTallaEdad, percentilosPesoEdad, imc, onClick }) => {
    return (
        <div className="history-list-item" style={{ border: '1px solid #1c8f28', padding: '12px', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer' }}>
            <div className="history-header">
                <span >{fechaCreacion}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <h3>{descripcion}</h3>
                <p><strong>Peso:</strong> {peso} kg</p>
                <p><strong>Altura:</strong> {altura} m</p>
                <p><strong>Talla:</strong> {talla} m</p>
                <p><strong>Percentilo Talla/Edad:</strong> {percentiloTallaEdad}</p>
                <p><strong>Percentilo Peso/Edad:</strong> {percentilosPesoEdad}</p>
                <p><strong>IMC:</strong> {imc}</p>
            </div>
        </div>
    );
};

export default HistoryListItem;
