import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import { AdminPage, PageHeader, Card, Btn, Badge, Toggle, Modal, ConfirmDialog, Spinner, Input, Textarea, FileInput, Select, Toast } from '../components/AdminUI'
import { Plus, Pencil, Trash2, Calendar, User } from 'lucide-react'

const EMPTY = { 
  title: '', 
  category: '', 
  excerpt: '', 
  content: '', 
  author: '', 
  is_published: false, 
  published_at: '' 
}

export default function AdminNews() {
  const { get, post, put, del } = useApi()
  const [items, setItems] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPrev, setCoverPrev] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams({ 
      page, 
      per_page: 12, 
      ...(filter && { status: filter }) 
    }).toString()
    
    get(`/admin/news?${params}`)
      .then(d => { 
        setItems(d.data ?? [])
        setMeta(d.meta ?? {}) 
      })
      .catch(err => showToast('Erreur lors du chargement', 'error'))
      .finally(() => setLoading(false))
  }
  
  useEffect(load, [page, filter])

  const showToast = (msg, type = 'success') => { 
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000) 
  }

  const openCreate = () => { 
    setEditing(null)
    setForm(EMPTY)
    setCoverFile(null)
    setCoverPrev(null)
    setModal(true) 
  }
  
  const openEdit = (item) => {
    setEditing(item)
    setForm({ 
      title: item.title, 
      category: item.category ?? '', 
      excerpt: item.excerpt, 
      content: item.content, 
      author: item.author ?? '', 
      is_published: item.is_published, 
      published_at: item.published_at ? item.published_at.split('T')[0] : '' 
    })
    setCoverPrev(item.cover_url ?? null)
    setCoverFile(null)
    setModal(true)
  }

  const handleSave = async () => {
    // Validation basique côté client
    if (!form.title || !form.excerpt || !form.content) {
      showToast('Veuillez remplir tous les champs obligatoires (*)', 'error')
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      
      // Ajouter tous les champs du formulaire
      fd.append('title', form.title || '')
      fd.append('category', form.category || '')
      fd.append('excerpt', form.excerpt || '')
      fd.append('content', form.content || '')
      fd.append('author', form.author || 'Salem Technology')
      fd.append('is_published', form.is_published ? '1' : '0')
      
      if (form.published_at) {
        fd.append('published_at', form.published_at)
      }
      
      // Ajouter l'image si présente
      if (coverFile) {
        fd.append('cover_image', coverFile)
      }
      
      let res
      if (editing) {
        // Pour PUT avec FormData, Laravel nécessite le champ _method
        fd.append('_method', 'PUT')
        res = await post(`/admin/news/${editing.id}`, fd)
      } else {
        res = await post('/admin/news', fd)
      }
      
      if (!res.success) throw new Error(res.message || 'Une erreur est survenue')
      
      showToast(editing ? 'Article mis à jour avec succès.' : 'Article créé avec succès.')
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
      const res = await del(`/admin/news/${id}`)
      if (res.success) {
        showToast('Article supprimé avec succès.')
      } else {
        showToast(res.message || 'Erreur lors de la suppression', 'error')
      }
      load()
    } catch (e) {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  const handleTogglePublished = async (item) => {
    try {
      const res = await put(`/admin/news/${item.id}`, { 
        is_published: !item.is_published 
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
    // Nettoyer la préview blob
    if (coverPrev && coverPrev.startsWith('blob:')) {
      URL.revokeObjectURL(coverPrev)
    }
    setModal(false)
    setCoverPrev(null)
    setCoverFile(null)
  }

  const f = (k) => (e) => setForm(p => ({...p, [k]: e.target.value}))

  const statusBadge = (item) => item.is_published
    ? <Badge color="green">Publié</Badge>
    : <Badge color="gray">Brouillon</Badge>

  return (
    <AdminPage>
      <PageHeader 
        title="Articles" 
        subtitle={`${meta.total ?? 0} article(s)`}
        action={
          <Btn onClick={openCreate}>
            <Plus size={15} /> Nouvel article
          </Btn>
        } 
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['', 'published', 'draft'].map(s => (
          <button 
            key={s} 
            onClick={() => { setFilter(s); setPage(1) }}
            style={{ 
              padding: '0.45rem 1rem', 
              borderRadius: '999px', 
              border: '1px solid', 
              borderColor: filter === s ? '#4fc3f7' : 'rgba(79,195,247,0.2)', 
              background: filter === s ? 'rgba(79,195,247,0.12)' : 'transparent', 
              color: filter === s ? '#4fc3f7' : 'rgba(186,230,253,0.5)', 
              fontSize: '0.78rem', 
              cursor: 'pointer', 
              fontFamily: "'DM Sans', sans-serif", 
              fontWeight: 500 
            }}
          >
            {s === '' ? 'Tous' : s === 'published' ? 'Publiés' : 'Brouillons'}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '1rem', 
            marginBottom: '1.25rem' 
          }}>
            {items.map(item => (
              <Card key={item.id} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {item.cover_url && (
                  <img 
                    src={item.cover_url} 
                    alt={item.title} 
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }} 
                  />
                )}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    {item.category && <Badge color="blue">{item.category}</Badge>}
                    {statusBadge(item)}
                  </div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.3 }}>
                    {item.title}
                  </div>
                  <p style={{ 
                    color: 'rgba(186,230,253,0.45)', 
                    fontSize: '0.78rem', 
                    margin: 0, 
                    overflow: 'hidden', 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical' 
                  }}>
                    {item.excerpt}
                  </p>
                  <div style={{ color: 'rgba(186,230,253,0.3)', fontSize: '0.72rem', marginTop: 'auto' }}>
                    <User size={10} style={{ display: 'inline', marginRight: '4px' }} /> {item.author} · 
                    <Calendar size={10} style={{ display: 'inline', marginLeft: '6px', marginRight: '4px' }} /> 
                    {item.published_at ? new Date(item.published_at).toLocaleDateString('fr-FR') : 'Non publié'}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.5rem', 
                    paddingTop: '0.5rem', 
                    borderTop: '1px solid rgba(79,195,247,0.08)' 
                  }}>
                    <Btn 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => openEdit(item)} 
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <Pencil size={13} /> Éditer
                    </Btn>
                    <Btn size="sm" variant="danger" onClick={() => setConfirm(item.id)}>
                      <Trash2 size={13} />
                    </Btn>
                  </div>
                </div>
              </Card>
            ))}
            
            {items.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'rgba(186,230,253,0.3)', fontSize: '0.85rem' }}>Aucun article.</p>
                <Btn onClick={openCreate} style={{ marginTop: '1rem' }}>
                  <Plus size={14} /> Créer un article
                </Btn>
              </div>
            )}
          </div>

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Btn 
                variant="ghost" 
                size="sm" 
                disabled={page <= 1} 
                onClick={() => setPage(p => p-1)}
              >
                ← Précédent
              </Btn>
              <span style={{ color: 'rgba(186,230,253,0.4)', fontSize: '0.82rem' }}>
                Page {page} / {meta.last_page}
              </span>
              <Btn 
                variant="ghost" 
                size="sm" 
                disabled={page >= meta.last_page} 
                onClick={() => setPage(p => p+1)}
              >
                Suivant →
              </Btn>
            </div>
          )}
        </>
      )}

      <Modal 
        open={modal} 
        onClose={handleCloseModal} 
        title={editing ? "Modifier l'article" : 'Nouvel article'} 
        width="660px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="Titre *" 
            value={form.title} 
            onChange={f('title')} 
            placeholder="Titre de l'article"
            required
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input 
              label="Catégorie (optionnel)" 
              value={form.category} 
              onChange={f('category')} 
              placeholder="Tech, Actualités…" 
            />
            <Input 
              label="Auteur" 
              value={form.author} 
              onChange={f('author')} 
              placeholder="Salem Technology" 
            />
          </div>
          
          <Textarea 
            label="Extrait *" 
            value={form.excerpt} 
            onChange={f('excerpt')} 
            style={{ minHeight: '70px' }}
            required
          />
          
          <Textarea 
            label="Contenu *" 
            value={form.content} 
            onChange={f('content')} 
            style={{ minHeight: '140px' }}
            required
          />
          
          <FileInput 
            label="Image de couverture (optionnel)" 
            accept="image/*" 
            preview={coverPrev} 
            onChange={handleCoverChange}
            help="Formats acceptés : jpeg, png, jpg, gif, webp (max 4Mo)"
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
            <Toggle 
              label="Publier l'article" 
              checked={form.is_published} 
              onChange={v => setForm(p => ({...p, is_published: v}))} 
            />
            {form.is_published && (
              <Input 
                label="Date de publication" 
                type="date" 
                value={form.published_at} 
                onChange={f('published_at')} 
              />
            )}
          </div>
          
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
        title="Supprimer l'article" 
        message="Cet article sera définitivement supprimé." 
      />

      <Toast toast={toast} />
    </AdminPage>
  )
}