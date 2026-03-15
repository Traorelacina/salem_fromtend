import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { AdminPage, PageHeader, Card, Btn, Badge, Toggle, Modal, ConfirmDialog, Spinner, Input, Textarea, FileInput, Select, Toast } from '../components/AdminUI'
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'

const EMPTY = { 
  title: '', 
  client: '', 
  category: '', 
  short_description: '', 
  content: '', 
  external_link: '', 
  android_link: '', 
  ios_link: '', 
  is_confidential: false, 
  is_active: true, 
  is_featured: false, 
  order: 0 
}

export default function AdminPortfolio() {
  const { get, post, put, del } = useApi()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [coverFile, setCoverFile] = useState(null)
  const [logoFile, setLogoFile] = useState(null)
  const [coverPrev, setCoverPrev] = useState(null)
  const [logoPrev, setLogoPrev] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)
  const [galleryModal, setGalleryModal] = useState(null)

  const load = () => { 
    setLoading(true)
    get('/admin/portfolio')
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
    setCoverFile(null)
    setLogoFile(null)
    setCoverPrev(null)
    setLogoPrev(null)
    setGalleryFiles([])
    setModal(true)
  }
  
  const openEdit = (item) => {
    setEditing(item)
    setForm({ 
      title: item.title, 
      client: item.client, 
      category: item.category, 
      short_description: item.short_description, 
      content: item.content, 
      external_link: item.external_link ?? '', 
      android_link: item.android_link ?? '', 
      ios_link: item.ios_link ?? '', 
      is_confidential: item.is_confidential, 
      is_active: item.is_active, 
      is_featured: item.is_featured, 
      order: item.order 
    })
    setCoverPrev(item.cover_url ?? null)
    setLogoPrev(item.client_logo_url ?? null)
    setCoverFile(null)
    setLogoFile(null)
    setGalleryFiles([])
    setModal(true)
  }

  const handleSave = async () => {
    // Validation basique côté client
    if (!form.title || !form.client || !form.category || !form.short_description || !form.content) {
      showToast('Veuillez remplir tous les champs obligatoires (*)', 'error')
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      
      // Ajouter tous les champs du formulaire
      fd.append('title', form.title || '')
      fd.append('client', form.client || '')
      fd.append('category', form.category || '')
      fd.append('short_description', form.short_description || '')
      fd.append('content', form.content || '')
      fd.append('external_link', form.external_link || '')
      fd.append('android_link', form.android_link || '')
      fd.append('ios_link', form.ios_link || '')
      fd.append('order', form.order?.toString() || '0')
      fd.append('is_confidential', form.is_confidential ? '1' : '0')
      fd.append('is_active', form.is_active ? '1' : '0')
      fd.append('is_featured', form.is_featured ? '1' : '0')
      
      // Ajouter les images si présentes
      if (coverFile) {
        fd.append('cover_image', coverFile)
      }
      if (logoFile) {
        fd.append('client_logo', logoFile)
      }
      
      // Ajouter les fichiers de la galerie (uniquement pour la création)
      if (!editing && galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
          fd.append('gallery[]', file)
        })
      }
      
      let res
      if (editing) {
        // Pour PUT avec FormData, Laravel nécessite le champ _method
        fd.append('_method', 'PUT')
        res = await post(`/admin/portfolio/${editing.id}`, fd)
      } else {
        res = await post('/admin/portfolio', fd)
      }
      
      if (!res.success) throw new Error(res.message || 'Une erreur est survenue')
      
      showToast(editing ? 'Réalisation mise à jour avec succès.' : 'Réalisation créée avec succès.')
      setModal(false)
      load()
    } catch(e) { 
      console.error('Save error:', e)
      showToast(e.message || 'Erreur lors de l\'enregistrement', 'error')
    } finally { 
      setSaving(false) 
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await del(`/admin/portfolio/${id}`)
      if (res.success) {
        showToast('Réalisation supprimée avec succès.')
      } else {
        showToast(res.message || 'Erreur lors de la suppression', 'error')
      }
      load()
    } catch (e) {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  const handleDeleteImage = async (imgId) => {
    if (!confirm('Voulez-vous vraiment supprimer cette image ?')) return
    
    try {
      const res = await del(`/admin/portfolio/images/${imgId}`)
      if (res.success) { 
        showToast('Image supprimée avec succès.')
        load()
      }
    } catch (e) {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    setCoverFile(file)
    
    if (coverPrev && coverPrev.startsWith('blob:')) {
      URL.revokeObjectURL(coverPrev)
    }
    
    if (file) {
      setCoverPrev(URL.createObjectURL(file))
    } else {
      setCoverPrev(null)
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    setLogoFile(file)
    
    if (logoPrev && logoPrev.startsWith('blob:')) {
      URL.revokeObjectURL(logoPrev)
    }
    
    if (file) {
      setLogoPrev(URL.createObjectURL(file))
    } else {
      setLogoPrev(null)
    }
  }

  const handleGalleryChange = (e) => {
    setGalleryFiles([...e.target.files])
  }

  const handleCloseModal = () => {
    if (coverPrev && coverPrev.startsWith('blob:')) {
      URL.revokeObjectURL(coverPrev)
    }
    if (logoPrev && logoPrev.startsWith('blob:')) {
      URL.revokeObjectURL(logoPrev)
    }
    setModal(false)
    setCoverPrev(null)
    setLogoPrev(null)
    setCoverFile(null)
    setLogoFile(null)
    setGalleryFiles([])
  }

  const f = (k) => (e) => setForm(p => ({...p, [k]: e.target.value}))

  const handleNumberChange = (k) => (e) => {
    const value = parseInt(e.target.value) || 0
    setForm(p => ({...p, [k]: value}))
  }

  const statusBadge = (item) => {
    if (item.is_confidential) return <Badge color="gray">Confidentiel</Badge>
    if (item.is_featured)     return <Badge color="orange">Vedette</Badge>
    if (!item.is_active)      return <Badge color="red">Inactif</Badge>
    return <Badge color="green">Actif</Badge>
  }

  return (
    <AdminPage>
      <PageHeader 
        title="Réalisations" 
        subtitle={`${items.length} projet(s)`} 
        action={
          <Btn onClick={openCreate}>
            <Plus size={15} /> Nouvelle réalisation
          </Btn>
        } 
      />

      {loading ? (
        <Spinner />
      ) : (
        <Card>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(79,195,247,0.1)' }}>
                {['Projet','Client','Catégorie','Images','Statut','Actions'].map(h => (
                  <th key={h} style={{ padding:'0.85rem 1rem', color:'rgba(186,230,253,0.45)', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', textAlign:'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom:'1px solid rgba(79,195,247,0.05)', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(79,195,247,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'0.85rem 1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      {item.cover_url && (
                        <img 
                          src={item.cover_url} 
                          alt="" 
                          style={{ width:'44px', height:'32px', objectFit:'cover', borderRadius:'6px', flexShrink:0 }} 
                        />
                      )}
                      <div>
                        <div style={{ color:'white', fontSize:'0.85rem', fontWeight:600 }}>{item.title}</div>
                        {item.slug && (
                          <div style={{ color:'rgba(186,230,253,0.35)', fontSize:'0.72rem' }}>{item.slug}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'0.85rem 1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      {item.client_logo_url && (
                        <img 
                          src={item.client_logo_url} 
                          alt="" 
                          style={{ width:'24px', height:'24px', objectFit:'contain', borderRadius:'4px' }} 
                        />
                      )}
                      <span style={{ color:'rgba(186,230,253,0.65)', fontSize:'0.82rem' }}>{item.client}</span>
                    </div>
                  </td>
                  <td style={{ padding:'0.85rem 1rem', color:'rgba(186,230,253,0.5)', fontSize:'0.82rem' }}>{item.category}</td>
                  <td style={{ padding:'0.85rem 1rem' }}>
                    <Btn size="sm" variant="ghost" onClick={() => setGalleryModal(item)}>
                      <ImageIcon size={13} /> {item.images?.length ?? 0}
                    </Btn>
                  </td>
                  <td style={{ padding:'0.85rem 1rem' }}>{statusBadge(item)}</td>
                  <td style={{ padding:'0.85rem 1rem' }}>
                    <div style={{ display:'flex', gap:'0.5rem' }}>
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
            <div style={{ textAlign:'center', padding:'3rem' }}>
              <ImageIcon size={40} style={{ color:'rgba(186,230,253,0.3)', marginBottom:'1rem' }} />
              <p style={{ color:'rgba(186,230,253,0.3)', fontSize:'0.85rem' }}>Aucune réalisation.</p>
              <Btn onClick={openCreate} style={{ marginTop:'1rem' }}>
                <Plus size={14} /> Créer une réalisation
              </Btn>
            </div>
          )}
        </Card>
      )}

      {/* Form modal */}
      <Modal 
        open={modal} 
        onClose={handleCloseModal} 
        title={editing ? 'Modifier la réalisation' : 'Nouvelle réalisation'} 
        width="680px"
      >
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <Input 
            label="Titre *" 
            value={form.title} 
            onChange={f('title')} 
            placeholder="Ex: Application Mobile E-commerce"
            required
          />
          
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <Input 
              label="Client *" 
              value={form.client} 
              onChange={f('client')} 
              placeholder="Nom du client"
              required
            />
            <Input 
              label="Catégorie *" 
              value={form.category} 
              onChange={f('category')} 
              placeholder="Web, Mobile, Logiciel…"
              required
            />
          </div>
          
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <Input 
              label="Ordre d'affichage" 
              type="number" 
              value={form.order} 
              onChange={handleNumberChange('order')}
              min="0"
            />
          </div>
          
          <Textarea 
            label="Description courte *" 
            value={form.short_description} 
            onChange={f('short_description')} 
            style={{ minHeight:'70px' }}
            required
          />
          
          <Textarea 
            label="Contenu détaillé *" 
            value={form.content} 
            onChange={f('content')} 
            style={{ minHeight:'120px' }}
            required
          />
          
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
            <Input 
              label="Lien web" 
              value={form.external_link} 
              onChange={f('external_link')} 
              placeholder="https://exemple.com" 
            />
            <Input 
              label="Lien Android" 
              value={form.android_link} 
              onChange={f('android_link')} 
              placeholder="https://play.google.com/…" 
            />
            <Input 
              label="Lien iOS" 
              value={form.ios_link} 
              onChange={f('ios_link')} 
              placeholder="https://apps.apple.com/…" 
            />
          </div>
          
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <FileInput 
              label="Image couverture (optionnel)" 
              accept="image/*" 
              preview={coverPrev} 
              onChange={handleCoverChange}
              help="Format: jpeg, png, jpg, gif, webp (max 4Mo)"
            />
            <FileInput 
              label="Logo client (optionnel)" 
              accept="image/*" 
              preview={logoPrev} 
              onChange={handleLogoChange}
              help="Format: jpeg, png, svg, gif (max 2Mo)"
            />
          </div>
          
          {!editing && (
            <div>
              <label style={{ 
                display:'block', 
                color:'rgba(186,230,253,0.6)', 
                fontSize:'0.75rem', 
                fontWeight:500, 
                marginBottom:'0.35rem', 
                letterSpacing:'0.04em', 
                textTransform:'uppercase' 
              }}>
                Galerie (optionnel - création uniquement)
              </label>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleGalleryChange} 
                style={{ color:'rgba(186,230,253,0.6)', fontSize:'0.82rem' }} 
              />
              {galleryFiles.length > 0 && (
                <p style={{ color:'rgba(34,197,94,0.8)', fontSize:'0.75rem', marginTop:'0.25rem' }}>
                  {galleryFiles.length} image(s) sélectionnée(s)
                </p>
              )}
            </div>
          )}
          
          <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
            <Toggle 
              label="Actif" 
              checked={form.is_active} 
              onChange={v => setForm(p=>({...p, is_active:v}))} 
            />
            <Toggle 
              label="En vedette" 
              checked={form.is_featured} 
              onChange={v => setForm(p=>({...p, is_featured:v}))} 
            />
            <Toggle 
              label="Confidentiel" 
              checked={form.is_confidential} 
              onChange={v => setForm(p=>({...p, is_confidential:v}))} 
            />
          </div>
          
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end' }}>
            <Btn variant="ghost" onClick={handleCloseModal}>
              Annuler
            </Btn>
            <Btn onClick={handleSave} disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </Btn>
          </div>
        </div>
      </Modal>

      {/* Gallery modal */}
      <Modal 
        open={!!galleryModal} 
        onClose={() => setGalleryModal(null)} 
        title={`Galerie — ${galleryModal?.title}`} 
        width="620px"
      >
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))', gap:'0.75rem' }}>
          {galleryModal?.images?.map(img => (
            <div key={img.id} style={{ position:'relative', borderRadius:'8px', overflow:'hidden', border:'1px solid rgba(79,195,247,0.1)' }}>
              <img 
                src={img.url} 
                alt={img.caption || ''} 
                style={{ width:'100%', height:'90px', objectFit:'cover', display:'block' }} 
              />
              <button 
                onClick={() => handleDeleteImage(img.id)}
                style={{ 
                  position:'absolute', 
                  top:'4px', 
                  right:'4px', 
                  background:'rgba(239,68,68,0.85)', 
                  border:'none', 
                  borderRadius:'50%', 
                  width:'22px', 
                  height:'22px', 
                  color:'white', 
                  cursor:'pointer', 
                  fontSize:'0.7rem', 
                  display:'flex', 
                  alignItems:'center', 
                  justifyContent:'center' 
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {!galleryModal?.images?.length && (
          <p style={{ textAlign:'center', color:'rgba(186,230,253,0.35)', fontSize:'0.85rem', padding:'2rem 0' }}>
            Aucune image dans la galerie.
          </p>
        )}
        <p style={{ color:'rgba(186,230,253,0.4)', fontSize:'0.78rem', marginTop:'1rem' }}>
          Pour ajouter des images, éditez la réalisation et utilisez le champ galerie (uniquement à la création).
        </p>
      </Modal>

      <ConfirmDialog 
        open={!!confirm} 
        onClose={() => setConfirm(null)} 
        onConfirm={() => handleDelete(confirm)}
        title="Supprimer la réalisation" 
        message="Toutes les images de la galerie seront également supprimées." 
      />

      <Toast toast={toast} />
    </AdminPage>
  )
}