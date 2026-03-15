import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { AdminPage, PageHeader, Card, Btn, Badge, StatCard, Modal, ConfirmDialog, Spinner, Select, Textarea } from '../components/AdminUI'

const STATUS_COLORS = { new:'orange', read:'blue', replied:'green', archived:'gray' }
const STATUS_LABELS = { new:'Nouveau', read:'Lu', replied:'Répondu', archived:'Archivé' }

export default function AdminContacts() {
  const { get, put, del } = useApi()
  const [items,   setItems]   = useState([])
  const [stats,   setStats]   = useState({})
  const [meta,    setMeta]    = useState({})
  const [page,    setPage]    = useState(1)
  const [filter,  setFilter]  = useState('')
  const [search,  setSearch]  = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [note,    setNote]    = useState('')
  const [status,  setStatus]  = useState('')
  const [saving,  setSaving]  = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [toast,   setToast]   = useState(null)

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams({ page, per_page: 15, ...(filter && { status: filter }), ...(search && { search }) }).toString()
    Promise.all([
      get(`/admin/contacts?${params}`),
      get('/admin/contacts/stats'),
    ]).then(([contacts, s]) => {
      setItems(contacts.data ?? [])
      setMeta(contacts.meta ?? {})
      setStats(s.data ?? {})
    }).finally(() => setLoading(false))
  }
  useEffect(load, [page, filter])

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const openMessage = async (item) => {
    setSelected(item)
    setNote(item.admin_note ?? '')
    setStatus(item.status)
    // auto mark as read
    if (item.status === 'new') {
      await put(`/admin/contacts/${item.id}`, { status: 'read' })
      load()
    }
  }

  const handleUpdate = async () => {
    setSaving(true)
    const res = await put(`/admin/contacts/${selected.id}`, { status, admin_note: note })
    setSaving(false)
    if (res.success) { showToast('Message mis à jour.'); setSelected(null); load() }
    else showToast(res.message, 'error')
  }

  const handleSearch = (e) => { e.preventDefault(); setPage(1); load() }

  return (
    <AdminPage>
      <PageHeader title="Messages" subtitle="Gestion des demandes de contact" />

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'1rem', marginBottom:'1.75rem' }}>
        <StatCard icon="📬" label="Total" value={stats.total ?? 0} />
        <StatCard icon="🔔" label="Nouveaux" value={stats.new ?? 0} />
        <StatCard icon="👁" label="Lus" value={stats.read ?? 0} />
        <StatCard icon="✅" label="Répondus" value={stats.replied ?? 0} />
        <StatCard icon="📦" label="Archivés" value={stats.archived ?? 0} />
      </div>

      {/* Search + filter bar */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap', alignItems:'center' }}>
        <form onSubmit={handleSearch} style={{ display:'flex', gap:'0.5rem', flex:1, minWidth:'200px' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom, email, sujet…"
            style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(79,195,247,0.15)', borderRadius:'8px', padding:'0.6rem 0.85rem', color:'white', fontSize:'0.82rem', outline:'none', fontFamily:"'DM Sans', sans-serif" }} />
          <Btn type="submit" variant="ghost" size="md">🔍</Btn>
        </form>
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
          {['','new','read','replied','archived'].map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(1) }}
              style={{ padding:'0.4rem 0.85rem', borderRadius:'999px', border:'1px solid', borderColor: filter===s ? '#4fc3f7' : 'rgba(79,195,247,0.2)', background: filter===s ? 'rgba(79,195,247,0.12)' : 'transparent', color: filter===s ? '#4fc3f7' : 'rgba(186,230,253,0.5)', fontSize:'0.75rem', cursor:'pointer', fontFamily:"'DM Sans', sans-serif", fontWeight:500 }}>
              {s === '' ? 'Tous' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          <Card>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(79,195,247,0.1)' }}>
                  {['Expéditeur','Email','Sujet','Société','Date','Statut',''].map(h => (
                    <th key={h} style={{ padding:'0.85rem 1rem', color:'rgba(186,230,253,0.45)', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', textAlign:'left', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}
                    onClick={() => openMessage(item)}
                    style={{ borderBottom:'1px solid rgba(79,195,247,0.05)', cursor:'pointer', transition:'background 0.15s', background: item.status === 'new' ? 'rgba(79,195,247,0.04)' : 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(79,195,247,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background= item.status==='new' ? 'rgba(79,195,247,0.04)' : 'transparent'}>
                    <td style={{ padding:'0.85rem 1rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                        <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg, #4fc3f7, #60a5fa)', display:'flex', alignItems:'center', justifyContent:'center', color:'#0b0f2a', fontWeight:700, fontSize:'0.72rem', flexShrink:0 }}>
                          {item.name?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ color: item.status==='new' ? 'white' : 'rgba(186,230,253,0.75)', fontSize:'0.85rem', fontWeight: item.status==='new' ? 600 : 400 }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:'0.85rem 1rem', color:'rgba(186,230,253,0.5)', fontSize:'0.8rem' }}>{item.email}</td>
                    <td style={{ padding:'0.85rem 1rem', color:'rgba(186,230,253,0.7)', fontSize:'0.82rem', maxWidth:'200px' }}>
                      <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.subject}</div>
                    </td>
                    <td style={{ padding:'0.85rem 1rem', color:'rgba(186,230,253,0.4)', fontSize:'0.8rem' }}>{item.company ?? '—'}</td>
                    <td style={{ padding:'0.85rem 1rem', color:'rgba(186,230,253,0.4)', fontSize:'0.78rem', whiteSpace:'nowrap' }}>
                      {new Date(item.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding:'0.85rem 1rem' }}>
                      <Badge color={STATUS_COLORS[item.status] ?? 'gray'}>{STATUS_LABELS[item.status] ?? item.status}</Badge>
                    </td>
                    <td style={{ padding:'0.85rem 1rem' }} onClick={e => e.stopPropagation()}>
                      <Btn size="sm" variant="danger" onClick={() => setConfirm(item.id)}>✕</Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 && <p style={{ textAlign:'center', color:'rgba(186,230,253,0.3)', padding:'3rem', fontSize:'0.85rem' }}>Aucun message.</p>}
          </Card>

          {meta.last_page > 1 && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', marginTop:'1rem' }}>
              <Btn variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(p => p-1)}>← Précédent</Btn>
              <span style={{ color:'rgba(186,230,253,0.4)', fontSize:'0.82rem' }}>Page {page} / {meta.last_page}</span>
              <Btn variant="ghost" size="sm" disabled={page >= meta.last_page} onClick={() => setPage(p => p+1)}>Suivant →</Btn>
            </div>
          )}
        </>
      )}

      {/* Message detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Détail du message" width="580px">
        {selected && (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              <div style={{ background:'rgba(79,195,247,0.05)', borderRadius:'8px', padding:'0.85rem' }}>
                <div style={{ color:'rgba(186,230,253,0.4)', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>Expéditeur</div>
                <div style={{ color:'white', fontWeight:600, fontSize:'0.88rem' }}>{selected.name}</div>
                {selected.company && <div style={{ color:'rgba(186,230,253,0.5)', fontSize:'0.78rem' }}>{selected.company}</div>}
              </div>
              <div style={{ background:'rgba(79,195,247,0.05)', borderRadius:'8px', padding:'0.85rem' }}>
                <div style={{ color:'rgba(186,230,253,0.4)', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>Contact</div>
                <div style={{ color:'#4fc3f7', fontSize:'0.85rem' }}>{selected.email}</div>
                {selected.phone && <div style={{ color:'rgba(186,230,253,0.5)', fontSize:'0.78rem' }}>{selected.phone}</div>}
              </div>
            </div>
            <div style={{ background:'rgba(79,195,247,0.05)', borderRadius:'8px', padding:'0.85rem' }}>
              <div style={{ color:'rgba(186,230,253,0.4)', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>Sujet</div>
              <div style={{ color:'white', fontWeight:600 }}>{selected.subject}</div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.02)', borderRadius:'8px', padding:'0.85rem', border:'1px solid rgba(79,195,247,0.08)' }}>
              <div style={{ color:'rgba(186,230,253,0.4)', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'6px' }}>Message</div>
              <p style={{ color:'rgba(186,230,253,0.75)', fontSize:'0.85rem', margin:0, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{selected.message}</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <Select label="Statut" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="new">Nouveau</option>
                <option value="read">Lu</option>
                <option value="replied">Répondu</option>
                <option value="archived">Archivé</option>
              </Select>
              <div>
                <div style={{ color:'rgba(186,230,253,0.4)', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'4px' }}>Reçu le</div>
                <div style={{ color:'rgba(186,230,253,0.6)', fontSize:'0.85rem', paddingTop:'0.5rem' }}>{new Date(selected.created_at).toLocaleString('fr-FR')}</div>
              </div>
            </div>
            <Textarea label="Note interne" value={note} onChange={e => setNote(e.target.value)} placeholder="Note privée pour l'équipe…" style={{ minHeight:'80px' }} />
            {selected.replied_at && (
              <div style={{ color:'rgba(186,230,253,0.35)', fontSize:'0.75rem', textAlign:'right' }}>
                Répondu le {new Date(selected.replied_at).toLocaleDateString('fr-FR')}
              </div>
            )}
            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end' }}>
              <Btn variant="ghost" onClick={() => setSelected(null)}>Fermer</Btn>
              <Btn onClick={handleUpdate} disabled={saving}>{saving ? 'Mise à jour…' : 'Mettre à jour'}</Btn>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => del(`/admin/contacts/${confirm}`).then(() => { showToast('Message supprimé.'); load() })}
        title="Supprimer le message" message="Ce message sera définitivement supprimé." />

      {toast && <div style={{ position:'fixed', bottom:'1.5rem', right:'1.5rem', zIndex:2000, padding:'0.75rem 1.25rem', borderRadius:'10px', fontSize:'0.82rem', fontWeight:600, background: toast.type==='error'?'rgba(239,68,68,0.9)':'rgba(34,197,94,0.9)', color:'white', boxShadow:'0 8px 32px rgba(0,0,0,0.4)', animation:'fadeUp 0.3s ease' }}>{toast.msg}</div>}
    </AdminPage>
  )
}