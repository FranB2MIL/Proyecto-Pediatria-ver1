# MediTrack — Frontend (Proyecto Pediatría)

Contexto del repo para retomar el trabajo. **Objetivo inmediato: conectar el módulo de
turnos a la API real.** Hoy la vista funciona completa pero contra datos mock.

---

## Los dos repos

| | Repo | Cómo se levanta | Puerto |
|---|---|---|---|
| Front | `Proyecto-Pediatria-ver1` (este) | `npm run dev` | `http://localhost:5173` |
| Back | `MediTrackAPI` | `dotnet run` desde `WebApi/` | `http://localhost:5072` |

El backend tiene CORS habilitado **solo** para `http://localhost:5173`. Si Vite arranca en
otro puerto (porque el 5173 está ocupado), todos los requests fallan por CORS.

Swagger del back: `http://localhost:5072/swagger`

---

## Stack

React 19 + Vite 8, `react-router-dom` 7, `date-fns` 4, CSS Modules.

Sin librería de UI, sin estado global (Redux/Zustand), sin cliente HTTP (se usa `fetch`
pelado). Mantener así salvo que haya una razón fuerte.

---

## Convenciones del código

- Un componente por carpeta, con su `Componente.module.css` al lado
- `views/` = pantallas atadas a una ruta; `components/` = piezas reutilizables
- **Ningún componente hace `fetch` directo.** Todo pasa por `services/`
- Los servicios devuelven promesas y tiran `Error` si `!response.ok` (fetch no falla solo
  con un 401 o 500)
- Patrón de carga de datos en componentes: tres `useState` (datos, `loading`, `error`) +
  `useEffect`, con `try/catch/finally`
- Props hacia abajo, callbacks hacia arriba. Los componentes de presentación no conocen
  los services
- Nunca mutar arrays/objetos de estado: siempre copias (`...spread`, `.map`, `.filter`)

### Paleta (viene de Figma, respetarla)

```
fondo página  #FBF7F2     texto principal   #2B2320
fondo card    #FFFFFF     texto secundario  #5C544C
bordes        #EFE7DC     texto atenuado    #8A8078
acento        #C0392B     navbar            #F5DFDA
verde  #7FA88A / #EAF1E8 / #3D6B4C   (estado OK)
ámbar  #D9A441 / #FBF1DE / #8A5A0A   (requiere atención)
```

Tipografías: `Fraunces` (serif) para títulos, `Inter` para el resto.

---

## Módulo de turnos — cómo está armado

Ruta `/turnos` → `views/AppointmentsView.jsx`

```
data/           datos crudos (mock)
  ↓
services/       "yo consigo los datos"  ← ESTO ES LO QUE HAY QUE CAMBIAR
  ↓
utils/slots.js  transforma franjas horarias en casilleros dibujables
  ↓
AppointmentsView.jsx   coordina: estado, pedidos y reparto
  ↓
components/     solo dibujan lo que reciben por props
```

### Archivos

| Archivo | Responsabilidad |
|---|---|
| `data/mockAvailability.js` | Franjas horarias del doctor (mock) |
| `data/mockAppointments.js` | Turnos agendados (mock) + enum `APPOINTMENT_STATUS` |
| `utils/dateUtils.js` | Cuentas con fechas/horas. `toDateKey`, `timeToMinutes`, etc. |
| `utils/slots.js` | `generateDaySlots`, `attachAppointments`, `buildWeekSlots` |
| `services/availabilityService.js` | **Mock.** Reemplazar por fetch real |
| `services/appointmentService.js` | **Mock.** Reemplazar por fetch real |
| `views/AppointmentsView.jsx` | Estado de la semana, fetch, composición |
| `components/calendarToolbar/` | Navegación ‹ Hoy › + rango de semana |
| `components/weekCalendar/` | Grilla de 7 columnas |
| `components/appointmentSlot/` | Un casillero individual |

### Conceptos clave

**`toDateKey(date)` → `'2026-08-17'`.** Se usa en todo el módulo como identificador de un
día: clave del objeto `slotsByDay`, `key` de React, y para comparar contra el campo `date`
de los turnos. Dos `Date` del mismo día no son iguales con `===`; dos strings sí.

**`generateDaySlots(availabilities, date)`** genera los huecos de turno de un día a partir
de las franjas. Corta con `minute + duration <= end` para no pasarse del horario.

**`slotsByDay`** es un objeto indexado por fecha (no un array), para que `WeekCalendar`
busque los slots de un día con `slotsByDay[key]` sin recorrer nada.

**`useMemo` en `weekDays` es obligatorio, no una optimización.** `getWeekDays` devuelve un
array nuevo cada vez; sin memo, el `useEffect` que depende de él se dispara en loop infinito.

---

## Estado actual

### ✅ Funciona
- Calendario semanal navegable (semana anterior / siguiente / hoy)
- Generación de slots desde la disponibilidad
- Colores por estado: verde reservado, ámbar cancelado, neutro libre
- El día de hoy resaltado
- Scroll independiente por columna

### 🟡 Mockeado (la tarea)
- `availabilityService.js` y `appointmentService.js` devuelven datos en memoria con un
  `delay(200)` que simula la red. **Las firmas de las funciones ya son las definitivas** —
  solo hay que cambiar el cuerpo
- `patientName` en los turnos: el mock lo trae inventado. La API real ya lo devuelve

### 🔴 Roto / pendiente
- **No hay login.** No existe vista de login, ni se guarda ningún token, ni se manda en
  ningún request
- **`doctorId = 1` hardcodeado** en `PatientList.jsx` y en `AppointmentsView.jsx`
- **`patientService.js` está roto contra el backend actual.** Manda `?doctorId=1` y sin
  token; el backend ahora saca el doctor del JWT y devuelve 401
- `consultationService.js` funciona de casualidad: el endpoint
  `GET /api/consultation/patient/{id}` tiene `[AllowAnonymous]` en el back
- Click en un slot solo hace `console.log` (`handleSlotClick` en `AppointmentsView`)
- Botón "Configurar disponibilidad" solo hace `console.log`
- El buscador de pacientes en `PatientList` no filtra nada
- `AppointmentsView` no tiene modal de crear/editar/cancelar turno

---

## Contrato de la API

Base: `http://localhost:5072/api` (configurable con `VITE_API_URL` en un `.env`)

### Auth (público)

```
POST /api/auth/register
  body: { firstName, lastName, email, password }

POST /api/auth/login
  body: { email, password }
  200:  { token, email, firstName }
  401:  { message: "Credenciales inválidas" }
```

El resto de los endpoints requieren el header:

```
Authorization: Bearer <token>
```

El `doctorId` sale del token en el backend (`User.GetDoctorId()`). **No se manda por
query string ni por body.**

### Disponibilidad

```
GET    /api/availability          → AvailabilityDto[]  (del doctor logueado)
POST   /api/availability          → AvailabilityDto
PUT    /api/availability/{id}     → 204
DELETE /api/availability/{id}     → 204
```

```jsonc
// AvailabilityDto
{
  "id": 1,
  "doctorId": 1,
  "dayOfWeek": 1,              // 0 = domingo ... 6 = sábado
  "startTime": "09:00",        // string, no TimeOnly
  "endTime": "12:00",
  "appointmentDuration": 30    // minutos
}
```

### Turnos

```
GET    /api/appointment?from=2026-08-17&to=2026-08-23  → AppointmentDto[]
GET    /api/appointment/{id}                            → AppointmentDto | 404
POST   /api/appointment                                 → AppointmentDto
PUT    /api/appointment/{id}                            → 204
PUT    /api/appointment/{id}/cancel                     → 204
DELETE /api/appointment/{id}                            → 204
```

```jsonc
// AppointmentDto
{
  "id": 1,
  "date": "2026-08-17",        // string yyyy-MM-dd
  "startTime": "09:00",        // string HH:mm
  "status": "Reservado",       // "Disponible" | "Reservado" | "Cancelado"
  "availabilityId": 1,
  "doctorId": 1,
  "patientId": 3,              // puede ser null
  "patientName": "María López" // puede ser null
}

// CreateAppointmentDto (body del POST)
{ "date": "2026-08-17", "startTime": "09:00", "availabilityId": 1, "patientId": 3 }
```

> **Importante:** los DTOs exponen fechas, horas y estados como **string** a propósito.
> .NET serializaría `TimeOnly` como `"09:00:00"`, `DateTime` como `"2026-08-17T00:00:00"`
> y el enum como número. Al convertirlos en el backend, **el front los consume tal cual y
> `utils/slots.js` no necesita ningún cambio.**

---

## La tarea: conectar al backend

### Paso 1 — Auth en el front

Crear:
- `services/authService.js` con `login(email, password)` y `logout()`
- `views/LoginView.jsx` + su `.module.css`
- Guardar el token. Nota: `localStorage` es lo práctico acá; si el equipo prefiere no
  usarlo, un context de React alcanza mientras no haga falta persistir entre recargas
- Ruta `/login` en `App.jsx` y redirección si no hay token

### Paso 2 — Wrapper de fetch

Crear `services/apiClient.js` que agregue el header `Authorization` automáticamente:

```js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5072/api'

export async function apiFetch(path, options = {}) {
  const token = /* leer el token guardado */
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 401) { /* limpiar token y mandar a /login */ }
  if (!response.ok) throw new Error(`Error ${response.status}`)
  if (response.status === 204) return null
  return response.json()
}
```

Que **todos** los services pasen por acá, incluidos `patientService` y
`consultationService`.

### Paso 3 — Reemplazar los services mock

Solo cambia el cuerpo de las funciones; los nombres y parámetros quedan igual (salvo que
sale el `doctorId`, que ahora viaja en el token):

```js
// availabilityService.js
export async function getAvailabilities() {
  return apiFetch('/availability')
}

// appointmentService.js
export async function getAppointmentsByWeek(from, to) {
  return apiFetch(`/appointment?from=${toDateKey(from)}&to=${toDateKey(to)}`)
}

export async function cancelAppointment(id) {
  return apiFetch(`/appointment/${id}/cancel`, { method: 'PUT' })
}
```

Borrar `data/mockAvailability.js` y `data/mockAppointments.js`. **Ojo:**
`APPOINTMENT_STATUS` vive en `mockAppointments.js` y lo importan `utils/slots.js` y
`components/appointmentSlot/AppointmentSlot.jsx` — moverlo a algo tipo
`constants/appointmentStatus.js` antes de borrar.

### Paso 4 — Sacar el `doctorId` hardcodeado

Buscar `doctorId = 1` en `PatientList.jsx` y `AppointmentsView.jsx` y eliminarlo, junto con
el parámetro en las llamadas a los services.

### Paso 5 — Arreglar `patientService.js`

```js
export async function getAllPatients() {
  return apiFetch('/patient')     // sin ?doctorId=
}
```

### Cómo verificar

1. Levantar el back (`dotnet run` desde `WebApi/`) y el front (`npm run dev`)
2. Registrar un doctor por Swagger, o por la vista de login nueva
3. Cargar disponibilidad por Swagger: `POST /api/availability` con
   `{ "dayOfWeek": 1, "startTime": "09:00", "endTime": "12:00", "appointmentDuration": 30 }`
4. En `/turnos`, el lunes tiene que mostrar 6 slots de 30 min (09:00 a 11:30)
5. En `/`, la lista de pacientes tiene que cargar sin 401

---

## Gotchas

**El backend necesita el JWT secret configurado.** Si `dotnet run` explota con
`IDX10703: key length is zero`, falta:

```bash
cd MediTrackAPI/WebApi
dotnet user-secrets set "JwtSettings:SecretKey" "clave-de-al-menos-32-caracteres"
```

No está en `appsettings.json` a propósito: no se commitea una clave de firma.

**El backend apunta a `net9.0`.** Hace falta el runtime de .NET 9 instalado; tener el 8 o
el 10 no alcanza.

**Archivos de iCloud.** `README.md`, `eslint.config.js`, `public/favicon.svg` y
`public/icons.svg` pueden aparecer como modificados en `git status` sin que nadie los haya
tocado — están dematerializados por iCloud Drive. **No incluirlos en los commits**
(usar `git add src/ package.json` en vez de `git add .`) o se suben vacíos.

**`http://localhost:5072/` a secas devuelve una página en blanco.** Es normal: no hay nada
mapeado en la raíz. La API está bajo `/api/...` y Swagger en `/swagger`.

**`GET /api/consultation/patient/{id}` es público** (`[AllowAnonymous]` en el back). Es
probable que sea temporal — no asumir que va a seguir así.

---

## Lo que quedó pendiente en el módulo de turnos (después de conectar)

1. **Modal de turno**: crear / editar / cancelar al hacer click en un slot.
   `handleSlotClick` en `AppointmentsView` ya recibe el slot completo
2. **Panel de disponibilidad**: que el doctor configure sus franjas.
   `handleConfigureAvailability` ya está cableado al botón
3. Formatear fechas en `HistoryListItem` (hoy muestra el ISO crudo del backend)
4. Los percentilos (`percentiloTallaEdad`, `percentilosPesoEdad`) que espera
   `HistoryListItem` no existen en el backend — `utils/percentileStatus.js` es un
   placeholder declarado como tal
