import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get('https://med-care-srirams-projects-4f261a65.vercel.app/verify-token', {
          withCredentials: true,
        })
        setIsAuthenticated(true)
      } catch {
        setIsAuthenticated(false)
      }
    }

    verifyToken()
  }, [])

  if (isAuthenticated === null) return <div className="text-center mt-20 text-lg text-green">Checking authentication...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default ProtectedRoute
