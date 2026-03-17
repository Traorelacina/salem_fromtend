import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { AdminPage, PageHeader, Card, Btn, Badge, Toggle, Modal, ConfirmDialog, Spinner, Input, Textarea, FileInput, TableHead, TableRow, Td, Toast } from '../components/AdminUI'
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
      .catch(() => showToast('Erreur lors du chargement', 'error'))
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
    setCoverFile(null); setLogoFile(null)
    setCoverPrev(null); setLogoPrev(null)
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
    setCoverFile(null); setLogoFile(null)
    setGalleryFiles([])
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.client || !form.category || !form.short_description || !form.content) {
      showToast('Veuillez remplir tous les champs obligatoires (*)', 'error')
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
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
      if (coverFile) fd.append('cover_image', coverFile)
      if (logoFile)  fd.append('client_logo', logoFile)
      if (!editing && galleryFiles.length > 0) {
        galleryFiles.forEach(file => fd.append('gallery[]', file))
      }
      let res
      if (editing) {
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
      showToast(e.message || "Erreur lors de l'enregistrement", 'error')
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
    if (!window.confirm('Voulez-vous vraiment supprimer cette image ?')) return
    try {
      const res = await del(`/admin/portfolio/images/${imgId}`)
      if (res.success) { showToast('Image supprimée avec succès.'); load() }
    } catch (e) {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    setCoverFile(file)
    if (coverPrev && coverPrev.startsWith('blob:')) URL.revokeObjectURL(coverPrev)
    setCoverPrev(file ? URL.createObjectURL(file) : null)
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    setLogoFile(file)
    if (logoPrev && logoPrev.startsWith('blob:')) URL.revokeObjectURL(logoPrev)
    setLogoPrev(file ? URL.createObjectURL(file) : null)
  }

  const handleGalleryChange = (e) => setGalleryFiles([...e.target.files])

  const handleCloseModal = () => {
    if (coverPrev && coverPrev.startsWith('blob:')) URL.revokeObjectURL(coverPrev)
    if (logoPrev  && logoPrev.startsWith('blob:'))  URL.revokeObjectURL(logoPrev)
    setModal(false)
    setCoverPrev(null); setLogoPrev(null)
    setCoverFile(null); setLogoFile(null)
    setGalleryFiles([])
  }

  const f = (k) => (e) => setForm(p => ({...p, [k]: e.target.value}))
  const handleNumberChange = (k) => (e) => setForm(p => ({...p, [k]: parseInt(e.target.value) || 0}))

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
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHead cols={['Projet', 'Client', 'Catégorie', 'Images', 'Statut', 'Actions']} />
            <tbody>
              {items.map(item => (
                <TableRow key={item.id}>

                  {/* Projet */}
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {item.cover_url ? (
                        <img 
                          src={item.cover_url} alt=""
                          style={{ width: '44px', height: '32px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0, border: '1px solid var(--border)' }} 
                        />
                      ) : (
                        <div style={{ width: '44px', height: '32px', borderRadius: '6px', background: '#f1f5f9', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <ImageIcon size={14} style={{ color: 'var(--text-3)' }} />
                        </div>
                      )}
                      <div>
                        <div style={{ color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600 }}>{item.title}</div>
                        {item.slug && (
                          <div style={{ color: 'var(--text-3)', fontSize: '0.72rem', fontFamily: 'monospace' }}>/{item.slug}</div>
                        )}
                      </div>
                    </div>
                  </Td>

                  {/* Client */}
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.client_logo_url && (
                        <img src={item.client_logo_url} alt="" style={{ width: '22px', height: '22px', objectFit: 'contain', borderRadius: '4px' }} />
                      )}
                      <span style={{ color: 'var(--text-2)', fontSize: '0.83rem' }}>{item.client}</span>
                    </div>
                  </Td>

                  {/* Catégorie */}
                  <Td style={{ color: 'var(--text-2)', fontSize: '0.83rem' }}>{item.category}</Td>

                  {/* Images galerie */}
                  <Td>
                    <Btn size="sm" variant="ghost" onClick={() => setGalleryModal(item)}>
                      <ImageIcon size={13} /> {item.images?.length ?? 0}
                    </Btn>
                  </Td>

                  {/* Statut */}
                  <Td>{statusBadge(item)}</Td>

                  {/* Actions */}
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

          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <ImageIcon size={40} style={{ color: 'var(--border)', margin: '0 auto 1rem', display: 'block' }} />
              <p style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>Aucune réalisation.</p>
              <Btn onClick={openCreate} style={{ marginTop: '1rem' }}>
                <Plus size={14} /> Créer une réalisation
              </Btn>
            </div>
          )}
        </Card>
      )}

      {/* ── Formulaire modal ───────────────────────────────── */}
      <Modal 
        open={modal} 
        onClose={handleCloseModal} 
        title={editing ? 'Modifier la réalisation' : 'Nouvelle réalisation'} 
        width="680px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <Input label="Titre *" value={form.title} onChange={f('title')} placeholder="Ex : Application Mobile E-commerce" />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Client *"    value={form.client}   onChange={f('client')}   placeholder="Nom du client" />
            <Input label="Catégorie *" value={form.category} onChange={f('category')} placeholder="Web, Mobile, Logiciel…" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input label="Ordre d'affichage" type="number" value={form.order} onChange={handleNumberChange('order')} min="0" />
          </div>

          <Textarea label="Description courte *" value={form.short_description} onChange={f('short_description')} style={{ minHeight: '70px' }} />
          <Textarea label="Contenu détaillé *"   value={form.content}           onChange={f('content')}           style={{ minHeight: '120px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <Input label="Lien web"     value={form.external_link} onChange={f('external_link')} placeholder="https://exemple.com" />
            <Input label="Lien Android" value={form.android_link}  onChange={f('android_link')}  placeholder="https://play.google.com/…" />
            <Input label="Lien iOS"     value={form.ios_link}      onChange={f('ios_link')}       placeholder="https://apps.apple.com/…" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FileInput label="Image couverture (optionnel)" accept="image/*" preview={coverPrev} onChange={handleCoverChange} />
            <FileInput label="Logo client (optionnel)"      accept="image/*" preview={logoPrev}  onChange={handleLogoChange} />
          </div>

          {!editing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)' }}>
                Galerie (optionnel — création uniquement)
              </label>
              <input 
                type="file" accept="image/*" multiple onChange={handleGalleryChange}
                style={{ color: 'var(--text-2)', fontSize: '0.82rem', padding: '0.4rem 0' }} 
              />
              {galleryFiles.length > 0 && (
                <p style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 500 }}>
                  {galleryFiles.length} image(s) sélectionnée(s)
                </p>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <Toggle label="Actif"        checked={form.is_active}       onChange={v => setForm(p => ({...p, is_active: v}))} />
            <Toggle label="En vedette"   checked={form.is_featured}     onChange={v => setForm(p => ({...p, is_featured: v}))} />
            <Toggle label="Confidentiel" checked={form.is_confidential} onChange={v => setForm(p => ({...p, is_confidential: v}))} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
            <Btn variant="ghost" onClick={handleCloseModal}>Annuler</Btn>
            <Btn onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Btn>
          </div>
        </div>
      </Modal>

      {/* ── Galerie modal ──────────────────────────────────── */}
      <Modal 
        open={!!galleryModal} 
        onClose={() => setGalleryModal(null)} 
        title={`Galerie — ${galleryModal?.title}`} 
        width="620px"
      >
        {galleryModal?.images?.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {galleryModal.images.map(img => (
              <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={img.url} alt={img.caption || ''} style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block' }} />
                <button 
                  onClick={() => handleDeleteImage(img.id)}
                  style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(220,38,38,0.85)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', color: 'white', cursor: 'pointer', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >×</button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: '0.85rem', padding: '2rem 0' }}>
            Aucune image dans la galerie.
          </p>
        )}
        <p style={{ color: 'var(--text-3)', fontSize: '0.78rem', marginTop: '1rem' }}>
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
