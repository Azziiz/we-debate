import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { firebaseReady } from '../firebase'
import FirebaseNotice from './FirebaseNotice'

export function Loading() {
  return <div className="spinner" role="status" aria-label="Loading" />
}

// Requires a signed-in user. Pass `member` or `admin` to require a role.
export function RequireAuth({ children, member = false, admin = false }) {
  const { user, loading, isMember, isAdmin } = useAuth()
  const location = useLocation()

  if (!firebaseReady) {
    return (
      <div className="container page">
        <FirebaseNotice />
      </div>
    )
  }
  if (loading) return <Loading />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (admin && !isAdmin) return <Navigate to="/" replace />
  if (member && !isMember) return <Navigate to="/join" replace />
  return children
}
