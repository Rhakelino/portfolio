import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('supabase_token')

  if (!token) {
    // Redirect ke halaman login jika tidak ada token
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute