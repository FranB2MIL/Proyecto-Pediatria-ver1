import { createContext, useState } from 'react'

export const AuthContext = createContext(null)

function getStoredUser() {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState( () => localStorage.getItem('token'))
    const [user, setUser] = useState(getStoredUser)

    const handleUserLogin = (loginResponse) => {
        const loggedUser = {
            email: loginResponse.email,
            name: loginResponse.firstName,
            role: loginResponse.role,
        }

        localStorage.setItem('token', loginResponse.token)
        localStorage.setItem('user', JSON.stringify(loggedUser))
        setToken(loginResponse.token)
        setUser(loggedUser)
    }

    const handleUserLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ token, user, handleUserLogin, handleUserLogout }}>
            {children}
        </AuthContext.Provider>
    )
}