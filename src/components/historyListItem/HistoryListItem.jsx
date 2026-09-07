import React from 'react';
import styles from './HistoryListItem.module.css'
import { getPercentileStatus } from '../../utils/percentileStatus'

const HistoryListItem = ({ id, reason, date, description, weight, height, size, heightAgePercentile, weightAgePercentile, imc, onClick, onEdit, onDelete }) => {
    const status = getPercentileStatus(heightAgePercentile)
    return (
        <div className={styles.historyitem} style={{ borderLeftColor: status ? status.dotColor : '#EFE7DC' }}>
            <div className={styles.header}>
                <span >{date}</span>
                <div className={styles.actions}>

                {onEdit && (
                    <button
                    className={styles.editBtn}
                    onClick={() => onEdit({
                        id,
                        date,
                        reason,
                        description,
                        measurement: { weight, height, size },
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
                <h3>{reason}</h3>
                <p><strong>Peso:</strong> {weight} kg</p>
                <p><strong>Altura:</strong> {height} m</p>
                <p><strong>Talla:</strong> {size} m</p>
                <p><strong>Percentilo Talla/Edad:</strong> {heightAgePercentile}</p>
                <p><strong>Percentilo Peso/Edad:</strong> {weightAgePercentile}</p>
                <p><strong>IMC:</strong> {imc}</p>
            </div>
        </div>
    );
};

export default HistoryListItem;
