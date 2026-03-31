import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { injectAdminCSS } from '../components/AdminUI'
import {
  LayoutDashboard, Briefcase,
  Users, Newspaper, MessageSquare, LogOut,
  ChevronLeft, ChevronRight, Bell, Share2,
} from 'lucide-react'

const NAV = [
  { to: '/admin',           label: 'Tableau de bord',         Icon: LayoutDashboard, exact: true },
  { to: '/admin/portfolio', label: 'Solutions & Réalisations', Icon: Briefcase },
  { to: '/admin/clients',   label: 'Clients',                 Icon: Users },
  { to: '/admin/news',      label: 'Articles',                Icon: Newspaper },
  { to: '/admin/contacts',  label: 'Messages',                Icon: MessageSquare },
  { to: '/admin/socials',   label: 'Réseaux sociaux',         Icon: Share2 },
]

export default function AdminLayout() {
  injectAdminCSS()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => { await logout(); navigate('/admin/login') }
  const W = collapsed ? 70 : 240

  const sidebarContent = (
    <aside style={{
      width: W, minHeight: '100vh', background: 'var(--sidebar)',
      display: 'flex', flexDirection: 'column', transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      overflowX: 'hidden', flexShrink: 0, position: 'relative',
    }}>
      {/* Logo */}
      <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: collapsed ? '0' : '0 1.1rem 0 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'white', fontFamily: "'Lexend', sans-serif", lineHeight: 1.2 }}>SALEM</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.08em' }}>ADMIN PANEL</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '6px', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
        {!collapsed && <div style={{ padding: '0.5rem 1.25rem 0.35rem', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Navigation</div>}
        {NAV.map(({ to, label, Icon, exact }) => (
          <NavLink key={to} to={to} end={exact}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: collapsed ? '0.7rem 0' : '0.6rem 1.25rem',
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: isActive ? '#22c55e' : 'rgba(255,255,255,0.55)',
              background: isActive ? 'rgba(34,197,94,0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid #22c55e' : '3px solid transparent',
              textDecoration: 'none', fontSize: '0.83rem', fontWeight: isActive ? 600 : 400,
              transition: 'all 0.15s', whiteSpace: 'nowrap', overflow: 'hidden',
            })}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => {}}
          >
            <Icon size={16} style={{ flexShrink: 0 }} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse button when collapsed */}
      {collapsed && (
        <button onClick={() => setCollapsed(false)} style={{ margin: '0.5rem auto', width: '36px', height: '36px', background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
          <ChevronRight size={15} />
        </button>
      )}

      {/* User footer */}
      <div style={{ padding: collapsed ? '0.75rem 0' : '0.85rem 1rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', flexShrink: 0, justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>
          {user?.name?.[0]?.toUpperCase() ?? 'A'}
        </div>
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.75)', fontSize: '0.72rem', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(239,68,68,0.75)'}>
              <LogOut size={11} /> Déconnexion
            </button>
          </div>
        )}
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Sidebar sticky */}
      <div style={{ flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {sidebarContent}
      </div>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{ height: '64px', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.75rem', flexShrink: 0, position: 'sticky', top: 0, zIndex: 50 }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>Bienvenue,</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', fontFamily: "'Lexend', sans-serif" }}>{user?.name ?? 'Administrateur'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={{ width: '36px', height: '36px', borderRadius: '9px', background: '#f8fafc', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-green-lt)'; e.currentTarget.style.borderColor = 'var(--border-2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = 'var(--border)' }}>
              <Bell size={15} />
            </button>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}