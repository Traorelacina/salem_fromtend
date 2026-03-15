import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { AdminPage, PageHeader, Card, Btn, Toggle, Modal, ConfirmDialog, Spinner, Input, FileInput, Toast } from '../components/AdminUI'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'

const EMPTY = { 
  name: '', 
  website: '', 
  order: 0, 
  is_active: true 
}

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
      .catch(err => showToast('Erreur lors du chargement', 'error'))
      .finally(() => setLoading(false)) 
  }
  
  useEffect(load, [])

  const showToast = (msg, type = 'success') => { 
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000) 
  }

  const openCreate = () => { 
    setEditing(null)
    setForm(EMPTY)
    setLogoFile(null)
    setLogoPrev(null)
    setModal(true) 
  }
  
  const openEdit = (item) => {
    setEditing(item)
    setForm({ 
      name: item.name, 
      website: item.website ?? '', 
      order: item.order, 
      is_active: item.is_active 
    })
    setLogoPrev(item.logo_url ?? null)
    setLogoFile(null)
    setModal(true)
  }

  const handleSave = async () => {
    // Validation basique côté client
    if (!form.name) {
      showToast('Le nom du client est obligatoire', 'error')
      return
    }

    // Pour la création, le logo est obligatoire (selon la validation Laravel)
    if (!editing && !logoFile) {
      showToast('Le logo est obligatoire pour un nouveau client', 'error')
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      
      // Ajouter tous les champs du formulaire
      fd.append('name', form.name || '')
      fd.append('website', form.website || '')
      fd.append('order', form.order?.toString() || '0')
      fd.append('is_active', form.is_active ? '1' : '0')
      
      // Ajouter le logo si présent
      if (logoFile) {
        fd.append('logo', logoFile)
      }
      
      let res
      if (editing) {
        // Pour PUT avec FormData, Laravel nécessite le champ _method
        fd.append('_method', 'PUT')
        res = await post(`/admin/clients/${editing.id}`, fd)
      } else {
        res = await post('/admin/clients', fd)
      }
      
      if (!res.success) throw new Error(res.message || 'Une erreur est survenue')
      
      showToast(editing ? 'Client mis à jour avec succès.' : 'Client ajouté avec succès.')
      setModal(false)
      load()
    } catch(e) { 
      console.error('Save error:', e)
      showToast(e.message || "Erreur lors de l'enregistrement", 'error')
    } finally { 
      setSaving(false) 
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await del(`/admin/clients/${id}`)
      if (res.success) {
        showToast('Client supprimé avec succès.')
      } else {
        showToast(res.message || 'Erreur lors de la suppression', 'error')
      }
      load()
    } catch (e) {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  const handleToggleActive = async (item) => {
    try {
      const res = await put(`/admin/clients/${item.id}`, { 
        is_active: !item.is_active 
      })
      if (res.success) {
        load()
      } else {
        showToast('Erreur lors de la mise à jour', 'error')
      }
    } catch (e) {
      showToast('Erreur lors de la mise à jour', 'error')
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    setLogoFile(file)
    
    // Nettoyer l'ancienne préview
    if (logoPrev && logoPrev.startsWith('blob:')) {
      URL.revokeObjectURL(logoPrev)
    }
    
    if (file) {
      setLogoPrev(URL.createObjectURL(file))
    } else {
      setLogoPrev(null)
    }
  }

  const handleCloseModal = () => {
    // Nettoyer la préview blob
    if (logoPrev && logoPrev.startsWith('blob:')) {
      URL.revokeObjectURL(logoPrev)
    }
    setModal(false)
    setLogoPrev(null)
    setLogoFile(null)
  }

  // Simple drag-to-reorder
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
    const payload = items.map((item, idx) => ({ id: item.id, order: idx }))
    try {
      await post('/admin/clients/reorder', { items: payload })
      showToast('Ordre mis à jour avec succès.')
    } catch (e) {
      showToast('Erreur lors de la mise à jour de l\'ordre', 'error')
      load() // Recharger pour annuler les changements locaux
    }
  }

  return (
    <AdminPage>
      <PageHeader 
        title="Clients" 
        subtitle="Bandeau défilant — glissez pour réordonner"
        action={
          <Btn onClick={openCreate}>
            <Plus size={15} /> Ajouter un client
          </Btn>
        } 
      />

      {loading ? (
        <Spinner />
      ) : (
        <Card>
          {/* Aperçu du bandeau */}
          {items.filter(i => i.is_active).length > 0 && (
            <div style={{ 
              padding: '0.75rem', 
              display: 'flex', 
              gap: '12px', 
              flexWrap: 'wrap', 
              marginBottom: '0.5rem', 
              borderBottom: '1px solid rgba(79,195,247,0.08)',
              alignItems: 'center'
            }}>
              <span style={{ color: 'rgba(186,230,253,0.35)', fontSize: '0.75rem', padding: '0.5rem' }}>
                Aperçu du bandeau :
              </span>
              {items.filter(i => i.is_active).map(i => (
                i.logo_url ? (
                  <img 
                    key={i.id} 
                    src={i.logo_url} 
                    alt={i.name} 
                    style={{ height: '28px', objectFit: 'contain', filter: 'grayscale(0.4)' }} 
                  />
                ) : null
              ))}
            </div>
          )}

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(79,195,247,0.1)' }}>
                <th style={{ width: '30px', padding: '0.85rem 0.5rem' }}></th>
                <th style={{ padding: '0.85rem 1rem', color: 'rgba(186,230,253,0.45)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'left' }}>Logo</th>
                <th style={{ padding: '0.85rem 1rem', color: 'rgba(186,230,253,0.45)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'left' }}>Nom</th>
                <th style={{ padding: '0.85rem 1rem', color: 'rgba(186,230,253,0.45)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'left' }}>Site web</th>
                <th style={{ padding: '0.85rem 1rem', color: 'rgba(186,230,253,0.45)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'left' }}>Ordre</th>
                <th style={{ padding: '0.85rem 1rem', color: 'rgba(186,230,253,0.45)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'left' }}>Actif</th>
                <th style={{ padding: '0.85rem 1rem', color: 'rgba(186,230,253,0.45)', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'left' }}>Actions</th>
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
                  style={{ 
                    borderBottom: '1px solid rgba(79,195,247,0.05)', 
                    transition: 'background 0.15s', 
                    cursor: 'grab', 
                    background: dragging === i ? 'rgba(79,195,247,0.06)' : 'transparent',
                    opacity: dragging === i ? 0.8 : 1
                  }}
                  onMouseEnter={e => { if (dragging === null) e.currentTarget.style.background = 'rgba(79,195,247,0.03)' }}
                  onMouseLeave={e => { if (dragging === null) e.currentTarget.style.background = 'transparent' }}
                >
                  <td style={{ padding: '0.85rem 0.5rem', color: 'rgba(186,230,253,0.25)' }}>
                    <GripVertical size={16} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {item.logo_url ? (
                      <img 
                        src={item.logo_url} 
                        alt={item.name} 
                        style={{ height: '36px', maxWidth: '80px', objectFit: 'contain' }} 
                      />
                    ) : (
                      <div style={{ 
                        width: '44px', 
                        height: '36px', 
                        background: 'rgba(79,195,247,0.08)', 
                        borderRadius: '6px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'rgba(186,230,253,0.3)', 
                        fontSize: '0.7rem' 
                      }}>
                        logo
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {item.website ? (
                      <a 
                        href={item.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: '#4fc3f7', fontSize: '0.8rem', textDecoration: 'none' }}
                      >
                        {item.website}
                      </a>
                    ) : (
                      <span style={{ color: 'rgba(186,230,253,0.25)', fontSize: '0.8rem' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'rgba(186,230,253,0.5)', fontSize: '0.82rem' }}>{item.order}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <Toggle 
                      checked={item.is_active} 
                      onChange={() => handleToggleActive(item)} 
                    />
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Btn size="sm" variant="ghost" onClick={() => openEdit(item)}>
                        <Pencil size={13} /> Éditer
                      </Btn>
                      <Btn size="sm" variant="danger" onClick={() => setConfirm(item.id)}>
                        <Trash2 size={13} />
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'rgba(186,230,253,0.3)', fontSize: '0.85rem' }}>Aucun client.</p>
              <Btn onClick={openCreate} style={{ marginTop: '1rem' }}>
                <Plus size={14} /> Ajouter un client
              </Btn>
            </div>
          )}
        </Card>
      )}

      <Modal 
        open={modal} 
        onClose={handleCloseModal} 
        title={editing ? 'Modifier le client' : 'Ajouter un client'} 
        width="480px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="Nom *" 
            value={form.name} 
            onChange={e => setForm(p => ({...p, name: e.target.value}))} 
            placeholder="Nom du client"
            required
          />
          
          <Input 
            label="Site web (optionnel)" 
            value={form.website} 
            onChange={e => setForm(p => ({...p, website: e.target.value}))} 
            placeholder="https://exemple.com" 
          />
          
          <Input 
            label="Ordre d'affichage" 
            type="number" 
            value={form.order} 
            onChange={e => setForm(p => ({...p, order: parseInt(e.target.value) || 0}))}
            min="0"
          />
          
          <FileInput 
            label={editing ? "Logo (optionnel)" : "Logo *"} 
            accept="image/*" 
            preview={logoPrev} 
            onChange={handleLogoChange}
            help="Formats acceptés : jpeg, png, jpg, gif, webp, svg (max 2Mo)"
            required={!editing}
          />
          
          <Toggle 
            label="Actif (visible dans le bandeau)" 
            checked={form.is_active} 
            onChange={v => setForm(p => ({...p, is_active: v}))} 
          />
          
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <Btn variant="ghost" onClick={handleCloseModal}>
              Annuler
            </Btn>
            <Btn onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDialog 
        open={!!confirm} 
        onClose={() => setConfirm(null)} 
        onConfirm={() => handleDelete(confirm)}
        title="Supprimer le client" 
        message="Le logo sera également supprimé." 
      />

      <Toast toast={toast} />
    </AdminPage>
  )
}