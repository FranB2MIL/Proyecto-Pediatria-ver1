import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getDefaultHome } from "../utils/roles"

function RequireAuth({ allowedRoles }) {
  const { token, user } = useAuth()
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && !allowedRoles.some((role) => user.roles.includes(role))) {
    return <Navigate to={getDefaultHome(user.roles)} replace />
  }

  return <Outlet />
}

export default RequireAuth
