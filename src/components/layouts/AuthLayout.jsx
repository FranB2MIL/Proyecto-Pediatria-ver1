import { fullHeightStyle } from "./styles"
import { Outlet } from "react-router-dom"

function AuthLayout() {
  return (
    <div style={fullHeightStyle}>
      <Outlet />
    </div>
  )
}

export default AuthLayout