import React from 'react';
import styles from './HistoryListItem.module.css'
import { getPercentileStatus } from '../../utils/percentileStatus'

const HistoryListItem = ({ id,descripcion, fechaCreacion, description, peso, altura, talla, percentiloTallaEdad, percentilosPesoEdad, imc, onClick, onEdit, onDelete }) => {
    const status = getPercentileStatus(percentiloTallaEdad)
    return (
        <div className={styles.historyitem} style={{ borderLeftColor: status ? status.dotColor : '#EFE7DC' }}>
            <div className={styles.header}>
                <span >{fechaCreacion}</span>
                <div className={styles.actions}>

                {onEdit && (
                    <button
                    className={styles.editBtn}
                    onClick={() => onEdit({
                        id,
                        date: fechaCreacion,
                        reason: descripcion,
                        description,
                        measurement: { weight: peso, height: altura, size: talla },
                    })}
                    >
                        Editar
                    </button>
                )}
                {onDelete && (
                    <button
                    className={styles.deleteBtn}
                    onClick={() => onDelete(id)}
                    >
                        Eliminar
                    </button>
                )}
                </div>
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
