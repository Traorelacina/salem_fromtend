import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { injectAdminCSS } from '../components/AdminUI'
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  injectAdminCSS()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* Left panel — branding */}
      <div style={{
        flex: '0 0 420px',
        background: 'linear-gradient(160deg, #0d1f12 0%, #1a3322 50%, #0f2a1a 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '3rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(34,197,94,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(34,197,94,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(34,197,94,0.05)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(34,197,94,0.4)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '1rem', fontFamily: "'Lexend', sans-serif", lineHeight: 1.2 }}>SALEM</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', letterSpacing: '0.1em', fontWeight: 500 }}>TECHNOLOGY</div>
          </div>
        </div>

        {/* Center content */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)', marginBottom: '1.5rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'adm-pulse 2s infinite' }} />
            <span style={{ color: '#4ade80', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em' }}>Panneau d'administration</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 800, fontFamily: "'Lexend', sans-serif", lineHeight: 1.2, marginBottom: '1rem' }}>
            Gérez votre<br />
            <span style={{ color: '#22c55e' }}>présence</span> digitale
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.87rem', lineHeight: 1.7 }}>
            Contrôlez vos services, réalisations, articles et messages depuis un seul espace sécurisé.
          </p>
        </div>

        {/* Footer */}
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.72rem', position: 'relative' }}>
          © {new Date().getFullYear()} Salem Technology — Abidjan, Côte d'Ivoire
        </div>

        <style>{`@keyframes adm-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '380px', animation: 'adm-fadeUp 0.4s ease' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', fontFamily: "'Lexend', sans-serif", letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>Connexion</h2>
            <p style={{ color: '#64748b', fontSize: '0.87rem' }}>Entrez vos identifiants pour accéder au tableau de bord.</p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '9px', padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={16} style={{ color: '#dc2626', flexShrink: 0, marginTop: '1px' }} />
              <span style={{ color: '#dc2626', fontSize: '0.84rem', fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Adresse email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@salemtechnology.ci"
                  style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.5rem', border: '1.5px solid #e2e8f0', borderRadius: '9px', background: 'white', color: '#0f172a', fontSize: '0.87rem', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }}
                  onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.5rem', border: '1.5px solid #e2e8f0', borderRadius: '9px', background: 'white', color: '#0f172a', fontSize: '0.87rem', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.borderColor = '#16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)' }}
                  onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none' }} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: loading ? '#16a34a' : 'linear-gradient(135deg, #16a34a, #22c55e)', color: 'white', border: 'none', borderRadius: '9px', padding: '0.8rem', fontSize: '0.9rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(22,163,74,0.35)' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(22,163,74,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(22,163,74,0.35)' }}>
              {loading
                ? <><Loader2 size={17} style={{ animation: 'adm-spin 0.7s linear infinite' }} /> Connexion…</>
                : <> Se connecter <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.78rem', marginTop: '2rem' }}>
            Accès réservé aux administrateurs Salem Technology
          </p>
        </div>
      </div>
    </div>
  )
}