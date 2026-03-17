import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { AdminPage, PageHeader, Card, Btn, Toggle, Modal, ConfirmDialog, Spinner, Input, FileInput, Toast } from '../components/AdminUI'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'

const EMPTY = { name: '', website: '', order: 0, is_active: true }

export default function AdminClients() {
  const { get, post, put, del } = useApi()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [logoFile, setLogoFile] = useState(null)
  const [logoPrev, setLogoPrev] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)
  const [dragging, setDragging] = useState(null)

  const load = () => {
    setLoading(true)
    get('/admin/clients')
      .then(d => setItems(d.data ?? []))
      .catch(() => showToast('Erreur lors du chargement', 'error'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const openCreate = () => { setEditing(null); setForm(EMPTY); setLogoFile(null); setLogoPrev(null); setModal(true) }

  const openEdit = (item) => {
    setEditing(item)
    setForm({ name: item.name, website: item.website ?? '', order: item.order, is_active: item.is_active })
    setLogoPrev(item.logo_url ?? null)
    setLogoFile(null)
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.name) { showToast('Le nom du client est obligatoire', 'error'); return }
    if (!editing && !logoFile) { showToast('Le logo est obligatoire pour un nouveau client', 'error'); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('website', form.website || '')
      fd.append('order', form.order?.toString() || '0')
      fd.append('is_active', form.is_active ? '1' : '0')
      if (logoFile) fd.append('logo', logoFile)
      let res
      if (editing) { fd.append('_method', 'PUT'); res = await post(`/admin/clients/${editing.id}`, fd) }
      else res = await post('/admin/clients', fd)
      if (!res.success) throw new Error(res.message || 'Une erreur est survenue')
      showToast(editing ? 'Client mis à jour.' : 'Client ajouté.')
      setModal(false); load()
    } catch (e) { showToast(e.message || "Erreur lors de l'enregistrement", 'error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      const res = await del(`/admin/clients/${id}`)
      if (res.success) showToast('Client supprimé.')
      else showToast(res.message || 'Erreur lors de la suppression', 'error')
      load()
    } catch { showToast('Erreur lors de la suppression', 'error') }
  }

  const handleToggleActive = async (item) => {
    try {
      const res = await put(`/admin/clients/${item.id}`, { is_active: !item.is_active })
      if (res.success) load()
      else showToast('Erreur lors de la mise à jour', 'error')
    } catch { showToast('Erreur lors de la mise à jour', 'error') }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    setLogoFile(file)
    if (logoPrev && logoPrev.startsWith('blob:')) URL.revokeObjectURL(logoPrev)
    setLogoPrev(file ? URL.createObjectURL(file) : null)
  }

  const handleCloseModal = () => {
    if (logoPrev && logoPrev.startsWith('blob:')) URL.revokeObjectURL(logoPrev)
    setModal(false); setLogoPrev(null); setLogoFile(null)
  }

  const handleDragStart = (i) => setDragging(i)
  const handleDragOver = (e, i) => {
    e.preventDefault()
    if (dragging === null || dragging === i) return
    const reordered = [...items]
    const [moved] = reordered.splice(dragging, 1)
    reordered.splice(i, 0, moved)
    setItems(reordered)
    setDragging(i)
  }
  const handleDragEnd = async () => {
    setDragging(null)
    try {
      await post('/admin/clients/reorder', { items: items.map((item, idx) => ({ id: item.id, order: idx })) })
      showToast('Ordre mis à jour.')
    } catch { showToast("Erreur lors de la mise à jour de l'ordre", 'error'); load() }
  }

  return (
    <AdminPage>
      <PageHeader
        title="Clients"
        subtitle="Bandeau défilant — glissez pour réordonner"
        action={<Btn onClick={openCreate}><Plus size={15} /> Ajouter un client</Btn>}
      />

      {loading ? <Spinner /> : (
        <Card>
          {/* Aperçu bandeau */}
          {items.filter(i => i.is_active).length > 0 && (
            <div style={{ padding: '0.75rem 1rem', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid var(--border)', background: '#f8fafc', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              <span style={{ color: 'var(--text-3)', fontSize: '0.75rem', fontWeight: 600 }}>Aperçu bandeau :</span>
              {items.filter(i => i.is_active).map(i => i.logo_url ? (
                <img key={i.id} src={i.logo_url} alt={i.name} style={{ height: '28px', objectFit: 'contain', filter: 'grayscale(0.3) opacity(0.8)' }} />
              ) : null)}
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', background: '#f8fafc' }}>
                <th style={{ width: '30px', padding: '0.75rem 0.5rem' }}></th>
                {['Logo', 'Nom', 'Site web', 'Ordre', 'Actif', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.71rem', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={e => handleDragOver(e, i)}
                  onDragEnd={handleDragEnd}
                  style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s', cursor: 'grab', background: dragging === i ? 'var(--primary-lt)' : 'transparent', opacity: dragging === i ? 0.8 : 1 }}
                  onMouseEnter={e => { if (dragging === null) e.currentTarget.style.background = '#f8fafc' }}
                  onMouseLeave={e => { if (dragging === null) e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-3)' }}>
                    <GripVertical size={16} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {item.logo_url ? (
                      <img src={item.logo_url} alt={item.name} style={{ height: '36px', maxWidth: '80px', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ width: '44px', height: '36px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: '0.7rem' }}>logo</div>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>{item.name}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {item.website ? (
                      <a href={item.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '0.8rem', textDecoration: 'none' }}>{item.website}</a>
                    ) : (
                      <span style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-3)', fontSize: '0.82rem' }}>{item.order}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <Toggle checked={item.is_active} onChange={() => handleToggleActive(item)} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Btn size="sm" variant="ghost" onClick={() => openEdit(item)}><Pencil size={13} /> Éditer</Btn>
                      <Btn size="sm" variant="danger" onClick={() => setConfirm(item.id)}><Trash2 size={13} /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>Aucun client.</p>
              <Btn onClick={openCreate} style={{ marginTop: '1rem' }}><Plus size={14} /> Ajouter un client</Btn>
            </div>
          )}
        </Card>
      )}

      <Modal open={modal} onClose={handleCloseModal} title={editing ? 'Modifier le client' : 'Ajouter un client'} width="480px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Nom *" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Nom du client" />
          <Input label="Site web (optionnel)" value={form.website} onChange={e => setForm(p => ({...p, website: e.target.value}))} placeholder="https://exemple.com" />
          <Input label="Ordre d'affichage" type="number" value={form.order} onChange={e => setForm(p => ({...p, order: parseInt(e.target.value) || 0}))} min="0" />
          <FileInput label={editing ? 'Logo (optionnel)' : 'Logo *'} accept="image/*" preview={logoPrev} onChange={handleLogoChange} />
          <Toggle label="Actif (visible dans le bandeau)" checked={form.is_active} onChange={v => setForm(p => ({...p, is_active: v}))} />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={handleCloseModal}>Annuler</Btn>
            <Btn onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={() => handleDelete(confirm)} title="Supprimer le client" message="Le logo sera également supprimé." />
      <Toast toast={toast} />
    </AdminPage>
  )
}
