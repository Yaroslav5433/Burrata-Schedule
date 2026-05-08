import auth from '../utils/auth.js'
import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }) {
    if (!auth.isAuth()) {
      return <Navigate to="/login" replace />
    }
  
    return children
  }

export function AuthorizationRoute({ children }) {
  if (auth.isAuth()) {
    return <Navigate to="/" replace />
  }

  return children
}
