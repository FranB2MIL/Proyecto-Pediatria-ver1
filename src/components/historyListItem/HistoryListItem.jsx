import React from 'react';
import styles from './HistoryListItem.module.css'
import { formatDate } from '../../utils/dateUtils'
import { formatMeasure } from '../../utils/patientFormat'

const Measure = ({ value, unit }) => {
    const formatted = formatMeasure(value)
    return (
        <>
            {formatted}
            {formatted !== '—' && <span className={styles.unit}>{unit}</span>}
        </>
    )
}

const HistoryListItem = ({ id, reason, date, description, weight, height, size, imc, isLatest, onEdit, onDelete }) => {
    return (
        <tr className={styles.row}>
            <td className={styles.date}>{formatDate(date)}</td>
            <td className={styles.reasonCell}>
                <span className={styles.reason}>
                    {reason || '—'}
                    {isLatest && <span className={styles.badge}>Última</span>}
                </span>
                {description && (
                    <span className={styles.description} title={description}>{description}</span>
                )}
            </td>
            <td className={styles.num}><Measure value={weight} unit="kg" /></td>
            <td className={styles.num}><Measure value={height} unit="m" /></td>
            <td className={styles.num}><Measure value={size} unit="m" /></td>
            <td className={`${styles.num} ${styles.imc}`}>{formatMeasure(imc, { decimals: 2 })}</td>
            {(onEdit || onDelete) && (
                <td>
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
                </td>
            )}
        </tr>
    );
};

export default HistoryListItem;
