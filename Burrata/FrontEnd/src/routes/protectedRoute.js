import isAuth from '../utils/auth.js'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    if (!isAuth()) {
      return <Navigate to="/login" replace />
    }
  
    return children
  }

export default ProtectedRoute