import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { AdminPage, PageHeader, Card, Btn, Badge, Toggle, Modal, ConfirmDialog, Spinner, Input, Textarea, FileInput, Toast } from '../components/AdminUI'
import { Plus, Pencil, Trash2, Layers, Star, ExternalLink } from 'lucide-react'

const EMPTY = { 
  title: '', 
  short_description: '', 
  content: '', 
  external_link: '', 
  category: '', 
  order: 0, 
  is_active: true, 
  is_featured: false 
}

export default function AdminSolutions() {
  const { get, post, put, del } = useApi()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [logoFile, setLogoFile] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [logoPrev, setLogoPrev] = useState(null)
  const [coverPrev, setCoverPrev] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  const load = () => { 
    setLoading(true)
    get('/admin/solutions')
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
    setLogoFile(null)
    setCoverFile(null)
    setLogoPrev(null)
    setCoverPrev(null)
    setModal(true) 
  }
  
  const openEdit = (item) => {
    setEditing(item)
    setForm({ 
      title: item.title, 
      short_description: item.short_description, 
      content: item.content, 
      external_link: item.external_link ?? '', 
      category: item.category ?? '', 
      order: item.order, 
      is_active: item.is_active, 
      is_featured: item.is_featured 
    })
    setLogoPrev(item.logo_url ?? null)
    setCoverPrev(item.cover_url ?? null)
    setLogoFile(null)
    setCoverFile(null)
    setModal(true)
  }

  const handleSave = async () => {
    // Validation basique côté client
    if (!form.title || !form.short_description || !form.content) {
      showToast('Veuillez remplir tous les champs obligatoires (*)', 'error')
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      
      // Ajouter tous les champs du formulaire
      fd.append('title', form.title || '')
      fd.append('short_description', form.short_description || '')
      fd.append('content', form.content || '')
      fd.append('external_link', form.external_link || '')
      fd.append('category', form.category || '')
      fd.append('order', form.order?.toString() || '0')
      fd.append('is_active', form.is_active ? '1' : '0')
      fd.append('is_featured', form.is_featured ? '1' : '0')
      
      // Ajouter les images si présentes
      if (logoFile) {
        fd.append('logo', logoFile)
      }
      if (coverFile) {
        fd.append('cover_image', coverFile)
      }
      
      let res
      if (editing) {
        // Pour PUT avec FormData, Laravel nécessite le champ _method
        fd.append('_method', 'PUT')
        res = await post(`/admin/solutions/${editing.id}`, fd)
      } else {
        res = await post('/admin/solutions', fd)
      }
      
      if (!res.success) throw new Error(res.message || 'Une erreur est survenue')
      
      showToast(editing ? 'Solution mise à jour avec succès.' : 'Solution créée avec succès.')
      setModal(false)
      load()
    } catch (e) { 
      console.error('Save error:', e)
      showToast(e.message || "Erreur lors de l'enregistrement", 'error')
    } finally { 
      setSaving(false) 
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await del(`/admin/solutions/${id}`)
      if (res.success) {
        showToast('Solution supprimée avec succès.')
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
      const res = await put(`/admin/solutions/${item.id}`, { 
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

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    setCoverFile(file)
    
    // Nettoyer l'ancienne préview
    if (coverPrev && coverPrev.startsWith('blob:')) {
      URL.revokeObjectURL(coverPrev)
    }
    
    if (file) {
      setCoverPrev(URL.createObjectURL(file))
    } else {
      setCoverPrev(null)
    }
  }

  const handleCloseModal = () => {
    // Nettoyer les previews blob
    if (logoPrev && logoPrev.startsWith('blob:')) {
      URL.revokeObjectURL(logoPrev)
    }
    if (coverPrev && coverPrev.startsWith('blob:')) {
      URL.revokeObjectURL(coverPrev)
    }
    setModal(false)
    setLogoPrev(null)
    setCoverPrev(null)
    setLogoFile(null)
    setCoverFile(null)
  }

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleNumberChange = (k) => (e) => {
    const value = parseInt(e.target.value) || 0
    setForm(p => ({ ...p, [k]: value }))
  }

  return (
    <AdminPage>
      <PageHeader 
        title="Solutions" 
        subtitle={`${items.length} solution(s)`}
        action={
          <Btn onClick={openCreate}>
            <Plus size={15} /> Nouvelle solution
          </Btn>
        } 
      />

      {loading ? (
        <Spinner />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1rem' }}>
          {items.map(item => (
            <Card 
              key={item.id} 
              style={{ 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column', 
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.boxShadow = 'var(--shadow)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                e.currentTarget.style.transform = ''
              }}
            >
              {/* Cover */}
              <div style={{ 
                height: '120px', 
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                overflow: 'hidden', 
                position: 'relative' 
              }}>
                {item.cover_url ? (
                  <img 
                    src={item.cover_url} 
                    alt="" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <Layers size={36} style={{ color: '#86efac' }} />
                )}
                {item.is_featured && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                    <Badge color="orange">
                      <Star size={10} /> Vedette
                    </Badge>
                  </div>
                )}
              </div>

              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  {item.logo_url && (
                    <img 
                      src={item.logo_url} 
                      alt="" 
                      style={{ 
                        width: '36px', 
                        height: '36px', 
                        objectFit: 'contain', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border)', 
                        padding: '3px', 
                        flexShrink: 0, 
                        background: '#fff' 
                      }} 
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      fontWeight: 700, 
                      fontSize: '0.9rem', 
                      color: 'var(--text)', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {item.title}
                    </div>
                    {item.category && (
                      <Badge color="blue" style={{ marginTop: '3px' }}>{item.category}</Badge>
                    )}
                  </div>
                </div>

                <p style={{ 
                  color: 'var(--text-2)', 
                  fontSize: '0.8rem', 
                  lineHeight: 1.55, 
                  overflow: 'hidden', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', 
                  margin: 0, 
                  flex: 1 
                }}>
                  {item.short_description}
                </p>

                {item.external_link && (
                  <a 
                    href={item.external_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      color: 'var(--primary)', 
                      fontSize: '0.75rem', 
                      fontWeight: 500 
                    }}
                  >
                    <ExternalLink size={11} /> Voir le site
                  </a>
                )}

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  paddingTop: '0.75rem', 
                  borderTop: '1px solid var(--border)', 
                  marginTop: 'auto' 
                }}>
                  <Toggle 
                    checked={item.is_active} 
                    onChange={() => handleToggleActive(item)} 
                  />
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <Btn size="sm" variant="ghost" onClick={() => openEdit(item)}>
                      <Pencil size={13} />
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => setConfirm(item.id)}>
                      <Trash2 size={13} />
                    </Btn>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {items.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem' }}>
              <Layers size={40} style={{ color: 'var(--border)', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-3)', fontSize: '0.87rem' }}>
                Aucune solution. Créez votre première solution !
              </p>
              <Btn onClick={openCreate} style={{ marginTop: '1rem' }}>
                <Plus size={14} /> Créer une solution
              </Btn>
            </div>
          )}
        </div>
      )}

      <Modal 
        open={modal} 
        onClose={handleCloseModal} 
        title={editing ? 'Modifier la solution' : 'Nouvelle solution'} 
        width="640px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <Input 
            label="Titre *" 
            value={form.title} 
            onChange={f('title')} 
            placeholder="Ex: ERP sur mesure"
            required
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input 
              label="Catégorie" 
              value={form.category} 
              onChange={f('category')} 
              placeholder="ERP, Mobile, SaaS…" 
            />
            <Input 
              label="Ordre d'affichage" 
              type="number" 
              value={form.order} 
              onChange={handleNumberChange('order')}
              min="0"
            />
          </div>
          
          <Input 
            label="Lien externe (optionnel)" 
            value={form.external_link} 
            onChange={f('external_link')} 
            placeholder="https://exemple.com" 
          />
          
          <Textarea 
            label="Description courte *" 
            value={form.short_description} 
            onChange={f('short_description')} 
            style={{ minHeight: '75px' }}
            required
          />
          
          <Textarea 
            label="Contenu détaillé *" 
            value={form.content} 
            onChange={f('content')} 
            style={{ minHeight: '120px' }}
            required
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FileInput 
              label="Logo (optionnel)" 
              accept="image/*" 
              preview={logoPrev} 
              onChange={handleLogoChange}
              help="Format: jpeg, png, gif, webp, svg (max 2Mo)"
            />
            <FileInput 
              label="Image de couverture (optionnel)" 
              accept="image/*" 
              preview={coverPrev} 
              onChange={handleCoverChange}
              help="Format: jpeg, png, jpg, gif, webp (max 4Mo)"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Toggle 
              label="Solution active" 
              checked={form.is_active} 
              onChange={v => setForm(p => ({ ...p, is_active: v }))} 
            />
            <Toggle 
              label="Mettre en vedette" 
              checked={form.is_featured} 
              onChange={v => setForm(p => ({ ...p, is_featured: v }))} 
            />
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'flex-end', 
            paddingTop: '0.5rem', 
            borderTop: '1px solid var(--border)' 
          }}>
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
        title="Supprimer la solution" 
        message="Cette solution sera définitivement supprimée. Action irréversible." 
      />

      <Toast toast={toast} />
    </AdminPage>
  )
}