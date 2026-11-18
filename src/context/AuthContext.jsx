import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

const EMPTY_SESSION = { token: null, user: null }

// Devuelve null si no hay user o si tiene el formato viejo (role string, sin roles)
function parseStoredUser() {
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        return Array.isArray(user?.roles) && user.roles.length > 0 ? user : null
    } catch {
        return null
    }
}

// Token y user son válidos juntos o no lo son: una sesión a medias se limpia
function getStoredSession() {
    const token = localStorage.getItem('token')
    const user = parseStoredUser()

    if (token && user) return { token, user }

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return EMPTY_SESSION
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(getStoredSession)

    const handleUserLogin = (loginResponse) => {
        const loggedUser = {
            email: loginResponse.email,
            name: loginResponse.fullName,
            roles: loginResponse.roles,
        }

        localStorage.setItem('token', loginResponse.token)
        localStorage.setItem('user', JSON.stringify(loggedUser))
        setSession({ token: loginResponse.token, user: loggedUser })
    }

    const handleUserLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setSession(EMPTY_SESSION)
    }

    return (
        <AuthContext.Provider value={{ token: session.token, user: session.user, handleUserLogin, handleUserLogout }}>
            {children}
        </AuthContext.Provider>
    )
}
