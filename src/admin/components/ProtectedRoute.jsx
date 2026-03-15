import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/AdminUI'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight:'100vh', background:'#060919', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Spinner />
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  return children
}