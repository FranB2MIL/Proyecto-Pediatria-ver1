import styles from './DoctorListItem.module.css'
import { getAvatarColors } from '../../utils/patientFormat'

export default function DoctorListItem({ doctor, onSelect }) {
    const fullName = `${doctor.firstName} ${doctor.lastName}`;
    const initial = doctor.firstName?.charAt(0).toUpperCase();
    const avatarColors = getAvatarColors(fullName);

    return (
    <div
      className={styles.doctorListItem}
      onClick={() => onSelect(doctor)}
      style={{ cursor: 'pointer' }}
    >

       <div className={styles.avatar} style={{ background: avatarColors.bg, color: avatarColors.text }}> 
        {initial} 
        </div>

        <div className={styles.textBlock}>
        <p className={styles.name}>{fullName}</p>
        <p className={styles.details}>{doctor.email}</p>
        </div>
    </div>
    );
}