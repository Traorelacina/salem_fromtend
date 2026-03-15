import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { AdminPage, PageHeader, Card, Btn, Toggle, Modal, ConfirmDialog, Spinner, Input, Textarea, FileInput, TableHead, TableRow, Td, Toast } from '../components/AdminUI'
import { Plus, Pencil, Trash2, Settings, Image } from 'lucide-react'

const EMPTY = { 
  title: '', 
  short_description: '', 
  content: '', 
  order: 0, 
  is_active: true 
}

export default function AdminServices() {
  const { get, post, put, del } = useApi()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imgFile, setImgFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  const load = () => { 
    setLoading(true)
    get('/admin/services')
      .then(d => setItems(d.data ?? []))
      .catch(err => showToast('Erreur lors du chargement', 'error'))
      .finally(() => setLoading(false)) 
  }
  
  useEffect(load, [])

  const showToast = (msg, type = 'success') => { 
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500) 
  }

  const openCreate = () => { 
    setEditing(null)
    setForm(EMPTY)
    setImgFile(null)
    setPreview(null)
    setModal(true) 
  }
  
  const openEdit = (item) => {
    setEditing(item)
    setForm({ 
      title: item.title, 
      short_description: item.short_description, 
      content: item.content, 
      order: item.order, 
      is_active: item.is_active 
    })
    setPreview(item.image_url ?? null)
    setImgFile(null)
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.short_description || !form.content) {
      showToast('Veuillez remplir tous les champs obligatoires (*)', 'error')
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title || '')
      fd.append('short_description', form.short_description || '')
      fd.append('content', form.content || '')
      fd.append('order', form.order?.toString() || '0')
      fd.append('is_active', form.is_active ? '1' : '0')
      if (imgFile) fd.append('image', imgFile)
      
      let res
      if (editing) {
        fd.append('_method', 'PUT')
        res = await post(`/admin/services/${editing.id}`, fd)
      } else {
        res = await post('/admin/services', fd)
      }
      
      if (!res.success) throw new Error(res.message || 'Une erreur est survenue')
      showToast(editing ? 'Service mis à jour avec succès.' : 'Service créé avec succès.')
      setModal(false)
      load()
    } catch (e) { 
      console.error('Save error:', e)
      showToast(e.message || 'Erreur lors de l\'enregistrement', 'error')
    } finally { 
      setSaving(false) 
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await del(`/admin/services/${id}`)
      if (res.success) {
        showToast('Service supprimé avec succès.')
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
      const res = await put(`/admin/services/${item.id}`, { is_active: !item.is_active })
      if (res.success) { load() }
      else showToast('Erreur lors de la mise à jour', 'error')
    } catch (e) {
      showToast('Erreur lors de la mise à jour', 'error')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setImgFile(file)
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    if (file) setPreview(URL.createObjectURL(file))
    else setPreview(null)
  }

  const handleCloseModal = () => {
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setModal(false)
    setPreview(null)
    setImgFile(null)
  }

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const handleNumberChange = (k) => (e) => setForm(p => ({ ...p, [k]: parseInt(e.target.value) || 0 }))

  return (
    <AdminPage>
      <PageHeader 
        title="Services" 
        subtitle={`${items.length} service(s) configuré(s)`}
        action={
          <Btn onClick={openCreate}>
            <Plus size={15} /> Nouveau service
          </Btn>
        } 
      />

      {loading ? (
        <Spinner />
      ) : (
        <Card>
          {items.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <TableHead cols={['Service', 'Description', 'Ordre', 'Statut', 'Actions']} />
              <tbody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '42px', 
                          height: '42px', 
                          borderRadius: '10px', 
                          background: 'rgba(79,195,247,0.12)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          flexShrink: 0, 
                          overflow: 'hidden' 
                        }}>
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Settings size={18} style={{ color: '#4fc3f7' }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'white' }}>{item.title}</div>
                          {item.slug && (
                            <div style={{ fontSize: '0.72rem', color: 'rgba(186,230,253,0.35)', fontFamily: 'monospace' }}>/{item.slug}</div>
                          )}
                        </div>
                      </div>
                    </Td>
                    <Td style={{ color: 'rgba(186,230,253,0.55)', maxWidth: '260px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.83rem' }}>
                        {item.short_description}
                      </div>
                    </Td>
                    <Td>
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '6px', 
                        background: 'rgba(79,195,247,0.1)', 
                        fontSize: '0.8rem', 
                        fontWeight: 700, 
                        color: 'rgba(186,230,253,0.6)' 
                      }}>
                        {item.order}
                      </span>
                    </Td>
                    <Td>
                      <Toggle checked={item.is_active} onChange={() => handleToggleActive(item)} />
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Btn size="sm" variant="ghost" onClick={() => openEdit(item)}>
                          <Pencil size={13} /> Éditer
                        </Btn>
                        <Btn size="sm" variant="danger" onClick={() => setConfirm(item.id)}>
                          <Trash2 size={13} />
                        </Btn>
                      </div>
                    </Td>
                  </TableRow>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Settings size={36} style={{ color: 'rgba(79,195,247,0.25)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'rgba(186,230,253,0.3)', fontSize: '0.87rem' }}>
                Aucun service. Créez votre premier service !
              </p>
              <Btn onClick={openCreate} style={{ marginTop: '1rem' }}>
                <Plus size={14} /> Créer un service
              </Btn>
            </div>
          )}
        </Card>
      )}

      <Modal 
        open={modal} 
        onClose={handleCloseModal} 
        title={editing ? 'Modifier le service' : 'Nouveau service'} 
        width="600px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <Input label="Titre *" value={form.title} onChange={f('title')} placeholder="Développement Web" required />
          <Textarea label="Description courte *" value={form.short_description} onChange={f('short_description')} style={{ minHeight: '75px' }} required />
          <Textarea label="Contenu complet *" value={form.content} onChange={f('content')} style={{ minHeight: '130px' }} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Ordre d'affichage" type="number" value={form.order} onChange={handleNumberChange('order')} min="0" />
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
              <Toggle label="Service actif" checked={form.is_active} onChange={v => setForm(p => ({ ...p, is_active: v }))} />
            </div>
          </div>
          <FileInput 
            label="Image du service (optionnel)" 
            accept="image/*" 
            preview={preview}
            onChange={handleFileChange}
            help="Formats acceptés : jpeg, png, jpg, gif, webp (max 2Mo)"
          />
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid rgba(79,195,247,0.1)' }}>
            <Btn variant="ghost" onClick={handleCloseModal}>Annuler</Btn>
            <Btn onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDialog 
        open={!!confirm} 
        onClose={() => setConfirm(null)} 
        onConfirm={() => handleDelete(confirm)}
        title="Supprimer le service" 
        message="Ce service sera définitivement supprimé du site. Cette action est irréversible." 
      />

      <Toast toast={toast} />
    </AdminPage>
  )
}