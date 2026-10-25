import { useEffect, useId, useRef, useState } from 'react'
import styles from './DoctorSelect.module.css'

const fullName = (doctor) => [doctor.firstName, doctor.lastName].filter(Boolean).join(' ')

// Nombre y, solo si el doctor la trae, la especialidad (sin dejar hueco si falta)
const DoctorInfo = ({ doctor }) => (
  <span className={styles.info}>
    <span className={styles.name}>{fullName(doctor)}</span>
    {doctor.specialty && <span className={styles.specialty}>{doctor.specialty}</span>}
  </span>
)

// Selector de doctor: botón con listbox desplegable. Sin fetch; el padre maneja el estado.
// doctors: [{ id, firstName, lastName, specialty? }]; selectedId: id (string); onChange(id: string).
const DoctorSelect = ({ doctors, selectedId, onChange }) => {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()

  const selectedIndex = Math.max(0, doctors.findIndex(d => String(d.id) === String(selectedId)))
  const selected = doctors[selectedIndex]

  // Abierto: el foco pasa a la lista y un clic fuera la cierra
  useEffect(() => {
    if (!open) return
    listRef.current?.focus()
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  // La opción resaltada con el teclado siempre queda a la vista
  useEffect(() => {
    if (open) listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  if (!selected) return null

  // Un solo doctor: caja informativa, sin flecha ni lista
  if (doctors.length === 1) {
    return (
      <div className={styles.root}>
        <div className={`${styles.box} ${styles.boxStatic}`}>
          <DoctorInfo doctor={selected} />
        </div>
      </div>
    )
  }

  const openList = () => {
    setActiveIndex(selectedIndex)
    setOpen(true)
  }

  const closeList = () => {
    setOpen(false)
    buttonRef.current?.focus()
  }

  const choose = (index) => {
    onChange(String(doctors[index].id))
    closeList()
  }

  const handleButtonKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openList()
    }
  }

  const handleListKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex(i => Math.min(doctors.length - 1, i + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex(i => Math.max(0, i - 1))
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(doctors.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        closeList()
        break
      case 'Tab':
        // Sin preventDefault: el foco vuelve al botón y el Tab sigue desde ahí
        closeList()
        break
      default:
    }
  }

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.box} ${styles.boxButton}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={handleButtonKeyDown}
      >
        <DoctorInfo doctor={selected} />
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label="Doctores"
          aria-activedescendant={`${listId}-${activeIndex}`}
          className={styles.list}
          onKeyDown={handleListKeyDown}
        >
          {doctors.map((doctor, index) => (
            <li
              key={doctor.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={[
                styles.option,
                index === selectedIndex ? styles.optionSelected : '',
                index === activeIndex ? styles.optionActive : '',
              ].join(' ')}
              onClick={() => choose(index)}
              onMouseMove={() => setActiveIndex(index)}
            >
              <DoctorInfo doctor={doctor} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DoctorSelect
