// ── Admin UI Components — palette sombre / gris / vert émeraude ──
import {
  X, Trash2, AlertCircle, Upload, Check, Loader2,
} from 'lucide-react'

// ── CSS Global injected once ──────────────────────────────
let cssInjected = false
export function injectAdminCSS() {
  if (cssInjected || typeof document === 'undefined') return
  cssInjected = true
  const s = document.createElement('style')
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Lexend:wght@700;800&display=swap');
    :root {
      --bg:          #0a0f1a;
      --bg-card:     #1a1f2b;
      --bg-green-lt: #132b1a;
      --sidebar:     #0d1f12;
      --sidebar-2:   #1a3322;
      --primary:     #10b981;
      --primary-dk:  #059669;
      --primary-lt:  #1a3a2a;
      --accent:      #34d399;
      --text:        #f0f4fa;
      --text-2:      #b0c0d0;
      --text-3:      #708090;
      --border:      #2a303c;
      --border-2:    #1a4731;
      --danger:      #f87171;
      --danger-lt:   #3b1e1e;
      --warning:     #fbbf24;
      --warning-lt:  #3b2e1a;
      --info:        #60a5fa;
      --info-lt:     #1a2b3b;
      --shadow-sm:   0 2px 4px rgba(0,0,0,0.4);
      --shadow:      0 8px 16px rgba(0,0,0,0.5);
      --shadow-lg:   0 16px 32px rgba(0,0,0,0.6);
      --radius:      10px;
      --radius-sm:   7px;
      --radius-lg:   14px;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--bg); font-family: 'Plus Jakarta Sans', sans-serif; color: var(--text); }
    input, textarea, select, button { font-family: inherit; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: #1a1f2b; }
    ::-webkit-scrollbar-thumb { background: #404b5c; border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: #5a6b80; }
    @keyframes adm-fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes adm-fadeIn  { from{opacity:0} to{opacity:1} }
    @keyframes adm-spin    { to{transform:rotate(360deg)} }
    @keyframes adm-slideIn { from{opacity:0;transform:scale(.97) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes adm-toastIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
  `
  document.head.appendChild(s)
}

// ── AdminPage ─────────────────────────────────────────────
export function AdminPage({ children }) {
  injectAdminCSS()
  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg)', animation: 'adm-fadeUp 0.3s ease' }}>
      {children}
    </div>
  )
}

// ── PageHeader ────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', fontFamily: "'Lexend', sans-serif", letterSpacing: '-0.02em' }}>{title}</h1>
        {subtitle && <p style={{ marginTop: '0.25rem', color: 'var(--text-2)', fontSize: '0.83rem', fontWeight: 400 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', ...style }}>
      {children}
    </div>
  )
}

// ── Btn ───────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled = false, type = 'button', style = {} }) {
  const sz = { sm: '0.38rem 0.85rem', md: '0.58rem 1.15rem', lg: '0.72rem 1.5rem' }
  const fs = { sm: '0.77rem', md: '0.84rem', lg: '0.9rem' }
  const v = {
    primary: { background: 'var(--primary)', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(16,185,129,0.3)' },
    danger:  { background: 'var(--danger-lt)', color: 'var(--danger)', border: '1px solid #5f2e2e' },
    ghost:   { background: 'var(--bg-card)', color: 'var(--text)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' },
    success: { background: 'var(--primary-lt)', color: 'var(--primary)', border: '1px solid var(--border-2)' },
    outline: { background: 'transparent', color: 'var(--primary)', border: '1.5px solid var(--primary)' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ padding: sz[size], fontSize: fs[size], borderRadius: 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s', whiteSpace: 'nowrap', ...v[variant], ...style }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.2)' }}
      onMouseLeave={e => { e.currentTarget.style.filter = '' }}>
      {children}
    </button>
  )
}

// ── Badge ─────────────────────────────────────────────────
export function Badge({ children, color = 'green' }) {
  const m = {
    green:  ['#1a3a2a','#10b981','#1a4731'],
    red:    ['#3b1e1e','#f87171','#5f2e2e'],
    orange: ['#3b2e1a','#fbbf24','#5f4a2e'],
    blue:   ['#1a2b3b','#60a5fa','#2a405c'],
    gray:   ['#2a303c','#b0c0d0','#404b5c'],
    purple: ['#2a1a3b','#c084fc','#4a2a5f'],
  }
  const [bg, tc, bc] = m[color] || m.gray
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, background: bg, color: tc, border: `1px solid ${bc}`, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

// ── Input ─────────────────────────────────────────────────
export function Input({ label, error, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      {label && <label style={{ fontSize: '0.77rem', fontWeight: 600, color: 'var(--text-2)' }}>{label}</label>}
      <input {...props} style={{ padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border)'}`, background: '#111620', color: 'var(--text)', fontSize: '0.85rem', outline: 'none', width: '100%', transition: 'border-color 0.15s, box-shadow 0.15s', ...props.style }}
        onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.2)' }}
        onBlur={e  => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'; e.target.style.boxShadow = 'none' }} />
      {error && <span style={{ fontSize: '0.72rem', color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
}

// ── Textarea ──────────────────────────────────────────────
export function Textarea({ label, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      {label && <label style={{ fontSize: '0.77rem', fontWeight: 600, color: 'var(--text-2)' }}>{label}</label>}
      <textarea {...props} style={{ padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: '#111620', color: 'var(--text)', fontSize: '0.85rem', outline: 'none', resize: 'vertical', minHeight: '100px', width: '100%', transition: 'border-color 0.15s, box-shadow 0.15s', ...props.style }}
        onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.2)' }}
        onBlur={e  => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' }} />
    </div>
  )
}

// ── Select ────────────────────────────────────────────────
export function Select({ label, children, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      {label && <label style={{ fontSize: '0.77rem', fontWeight: 600, color: 'var(--text-2)' }}>{label}</label>}
      <select {...props} style={{ padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: '#111620', color: 'var(--text)', fontSize: '0.85rem', outline: 'none', cursor: 'pointer', width: '100%', ...props.style }}>
        {children}
      </select>
    </div>
  )
}

// ── Toggle ────────────────────────────────────────────────
export function Toggle({ label, checked, onChange }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
      <div onClick={() => onChange(!checked)} style={{ width: '40px', height: '22px', borderRadius: '999px', background: checked ? 'var(--primary)' : '#404b5c', position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0, boxShadow: checked ? '0 0 0 3px rgba(16,185,129,0.25)' : 'none' }}>
        <div style={{ position: 'absolute', top: '2px', left: checked ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }} />
      </div>
      {label && <span style={{ fontSize: '0.83rem', fontWeight: 500, color: 'var(--text-2)' }}>{label}</span>}
    </label>
  )
}

// ── FileInput ─────────────────────────────────────────────
export function FileInput({ label, accept, onChange, preview }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      {label && <label style={{ fontSize: '0.77rem', fontWeight: 600, color: 'var(--text-2)' }}>{label}</label>}
      <label style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', background: '#111620', cursor: 'pointer', display: 'block', transition: 'border-color 0.15s, background 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'var(--bg-green-lt)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#111620' }}>
        {preview && <img src={preview} alt="" style={{ width: '100%', maxHeight: '110px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.5rem', display: 'block' }} />}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-2)', fontSize: '0.82rem' }}>
          <Upload size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>Cliquer pour choisir un fichier</span>
        </div>
        <input type="file" accept={accept} onChange={onChange} style={{ display: 'none' }} />
      </label>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = '540px' }) {
  if (!open) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', animation: 'adm-fadeIn 0.2s ease' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: width, maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', boxShadow: 'var(--shadow-lg)', animation: 'adm-slideIn 0.25s ease', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', fontFamily: "'Lexend', sans-serif" }}>{title}</h3>
          <button onClick={onClose} style={{ background: '#2a303c', border: 'none', borderRadius: '6px', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-2)', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#404b5c'}
            onMouseLeave={e => e.currentTarget.style.background = '#2a303c'}>
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── ConfirmDialog ─────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal open={open} onClose={onClose} title={title ?? 'Confirmer la suppression'} width="380px">
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--danger-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <AlertCircle size={20} style={{ color: 'var(--danger)' }} />
        </div>
        <p style={{ color: 'var(--text-2)', fontSize: '0.87rem', lineHeight: 1.65, paddingTop: '8px' }}>{message}</p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <Btn variant="ghost" onClick={onClose}>Annuler</Btn>
        <Btn variant="danger" onClick={() => { onConfirm(); onClose() }}>
          <Trash2 size={13} /> Supprimer
        </Btn>
      </div>
    </Modal>
  )
}

// ── Spinner ───────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '10px' }}>
      <Loader2 size={22} style={{ animation: 'adm-spin 0.7s linear infinite', color: 'var(--primary)' }} />
      <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>Chargement…</span>
    </div>
  )
}

// ── StatCard ──────────────────────────────────────────────
export function StatCard({ icon: Icon, label, value, trend, color = 'green' }) {
  const c = {
    green:  { bg: '#1a3a2a', ic: '#10b981', bd: '#1a4731' },
    blue:   { bg: '#1a2b3b', ic: '#60a5fa', bd: '#2a405c' },
    orange: { bg: '#3b2e1a', ic: '#fbbf24', bd: '#5f4a2e' },
    purple: { bg: '#2a1a3b', ic: '#c084fc', bd: '#4a2a5f' },
    red:    { bg: '#3b1e1e', ic: '#f87171', bd: '#5f2e2e' },
  }[color] || { bg: '#1a3a2a', ic: '#10b981', bd: '#1a4731' }
  return (
    <div style={{ background: 'var(--bg-card)', border: `1px solid ${c.bd}`, borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s', cursor: 'default' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = '' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} style={{ color: c.ic }} />
        </div>
      </div>
      <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text)', fontFamily: "'Lexend', sans-serif", lineHeight: 1 }}>{value}</div>
      {trend && <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>{trend}</div>}
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null
  const err = toast.type === 'error'
  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 3000, display: 'flex', alignItems: 'center', gap: '10px', padding: '0.85rem 1.2rem', borderRadius: 'var(--radius)', background: 'var(--bg-card)', border: `1.5px solid ${err ? '#5f2e2e' : '#1a4731'}`, boxShadow: 'var(--shadow-lg)', fontSize: '0.84rem', fontWeight: 500, color: 'var(--text)', animation: 'adm-toastIn 0.3s ease', maxWidth: '320px' }}>
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: err ? 'var(--danger-lt)' : 'var(--primary-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {err ? <AlertCircle size={14} style={{ color: 'var(--danger)' }} /> : <Check size={14} style={{ color: 'var(--primary)' }} />}
      </div>
      {toast.msg}
    </div>
  )
}

// ── Table helpers ─────────────────────────────────────────
export function TableHead({ cols }) {
  return (
    <thead>
      <tr style={{ borderBottom: '2px solid var(--border)', background: '#111620' }}>
        {cols.map(c => (
          <th key={c} style={{ padding: '0.75rem 1.1rem', textAlign: 'left', fontSize: '0.71rem', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{c}</th>
        ))}
      </tr>
    </thead>
  )
}

export function TableRow({ children, onClick, highlight }) {
  return (
    <tr onClick={onClick} style={{ borderBottom: '1px solid var(--border)', cursor: onClick ? 'pointer' : 'default', transition: 'background 0.12s', background: highlight ? 'var(--bg-green-lt)' : 'transparent' }}
      onMouseEnter={e => { if (!highlight) e.currentTarget.style.background = '#1e232f' }}
      onMouseLeave={e => { e.currentTarget.style.background = highlight ? 'var(--bg-green-lt)' : 'transparent' }}>
      {children}
    </tr>
  )
}

export function Td({ children, style = {} }) {
  return <td style={{ padding: '0.88rem 1.1rem', fontSize: '0.84rem', color: 'var(--text)', verticalAlign: 'middle', ...style }}>{children}</td>
}
