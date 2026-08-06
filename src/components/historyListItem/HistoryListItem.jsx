import React from 'react';
import styles from './HistoryListItem.module.css'

const HistoryListItem = ({ id,descripcion, fechaCreacion, peso, altura, talla, percentiloTallaEdad, percentilosPesoEdad, imc, onClick }) => {
    return (
        <div className={styles.historyitem}>
            <div className={styles.header}>
                <span >{fechaCreacion}</span>
            </div>
            <div className={styles.details}>
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
