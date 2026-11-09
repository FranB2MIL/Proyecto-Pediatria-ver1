# MediTrack — Frontend

Interfaz web de MediTrack, una plataforma para pediatras: gestión de pacientes, historial de consultas con mediciones y agenda de turnos. Trabajo final de Proyecto de Laboratorio. Integrantes: Bollea Francisco, Baccaglio Lautaro, Quiroga Tomas, Vecchia Lorenzo.

Consume la API del repositorio [MediTrackAPI](https://github.com/FranB2MIL/MediTrackAPI).

## Stack

React 19, Vite 8, `react-router-dom` 7, `date-fns`, `react-bootstrap` y CSS Modules. Sin librería de estado global: se usa `useState`, `useEffect` y Context.

## Cómo correrlo

Requisitos: Node.js (versión LTS reciente) y el backend corriendo.

```bash
npm install
npm run dev
```

La app queda en `http://localhost:5173`. **Tiene que ser ese puerto**: el backend solo permite ese origen por CORS, así que si Vite arranca en otro, todos los pedidos fallan.

Por defecto se conecta a `http://localhost:5072/api`. Para apuntar a otra dirección, definir `VITE_API_URL` en un archivo `.env`.

Otros comandos: `npm run build` (compilar) y `npm run lint`.

## Pantallas

| Ruta | Quién | Qué muestra |
|---|---|---|
| `/login`, `/register` | Paciente | Inicio de sesión y registro |
| `/staff/login` | Doctor y admin | Inicio de sesión del personal |
| `/` | Doctor | Lista de pacientes, ficha, historial de consultas y próximos turnos |
| `/turnos` | Doctor | Calendario semanal y configuración de disponibilidad |
| `/admin` | Admin | Alta, edición y baja de doctores; asignación de pacientes |
| `/mi-ficha` | Paciente | Su ficha, historial y turnos |
| `/mi-ficha/turnos` | Paciente | Reserva de turnos por doctor y semana |

## Estructura

```
src/
  pages/        pantallas, una por ruta
  components/   piezas reutilizables, cada una con su .module.css
  modal/        formularios y confirmaciones en modales
  hooks/        carga de datos y estado (usePatients, useConsultations, ...)
  services/     único lugar donde se hacen pedidos al backend (apiClient.js)
  context/      AuthContext: token y usuario de la sesión
  utils/        funciones puras de fechas, formato, mediciones y turnos
```

Convenciones: ningún componente llama a `fetch` directamente (todo pasa por `services/`); los servicios lanzan un `Error` si la respuesta no es exitosa; los datos se cargan con tres estados (`datos`, `loading`, `error`) y un `useEffect`.

## Sesión y seguridad

El token JWT y los datos básicos del usuario se guardan en `localStorage` y en el `AuthContext`. `apiFetch` agrega el token a cada pedido y, si el servidor responde 401 con un token guardado, cierra la sesión y redirige al login.

Las rutas están protegidas solo por la existencia del token. **La autorización por rol la hace el backend**: si un paciente entra a `/admin`, los pedidos reciben 403.

## Pendientes

- Los percentiles de talla y peso se muestran en la ficha, pero todavía no llegan datos porque el backend no los calcula; la clasificación de `percentileStatus.js` es provisoria.
- Falta un guardia de rutas por rol en el frontend.