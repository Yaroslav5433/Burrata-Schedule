import { is_admin_auth } from "@/utils/utils"
import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }) {
    if (!is_admin_auth()) {
      return <Navigate to="/login" replace />
    }
  
    return children
  }

export function AuthorizedRoute({ children }) {
  if (is_admin_auth()) {
    return <Navigate to="/admin/:department" replace />
  }

  return children
}
