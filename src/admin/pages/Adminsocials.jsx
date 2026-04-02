import { useState, useEffect, useRef } from 'react'
import { useApi } from '../hooks/useApi'
import {
  AdminPage, PageHeader, Card, Btn, Badge, Toggle,
  Modal, ConfirmDialog, Spinner, Input, Toast,
} from '../components/AdminUI'
import { Plus, Pencil, Trash2, Share2, Upload, Image as ImageIcon } from 'lucide-react'

const EMPTY = { name: '', url: '', order: 0, is_active: true }

export default function AdminSocials() {
  const { get, post, del } = useApi()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [iconFile, setIconFile] = useState(null)
  const [iconPrev, setIconPrev] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [toast, setToast] = useState(null)
  const fileRef = useRef()

  const load = () => {
    setLoading(true)
    get('/admin/socials')
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
    setIconFile(null)
    setIconPrev(null)
    setModal(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      name: item.name,
      url: item.url,
      order: item.order,
      is_active: item.is_active,
    })
    setIconFile(null)
    setIconPrev(item.icon_url ?? null)
    setModal(true)
  }

  const handleIconChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setIconFile(file)
    if (iconPrev?.startsWith('blob:')) URL.revokeObjectURL(iconPrev)
    setIconPrev(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.name || !form.url) {
      showToast('Veuillez remplir tous les champs obligatoires (*)', 'error')
      return
    }
    if (!editing && !iconFile) {
      showToast("Veuillez choisir une icône pour ce réseau social", 'error')
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('url', form.url)
      fd.append('order', String(form.order))
      fd.append('is_active', form.is_active ? '1' : '0')
      if (iconFile) fd.append('icon', iconFile)
      if (editing) fd.append('_method', 'PUT')

      const endpoint = editing ? `/admin/socials/${editing.id}` : '/admin/socials'
      const res = await post(endpoint, fd)

      if (!res.success) throw new Error(res.message || 'Erreur')
      showToast(editing ? 'Réseau social mis à jour.' : 'Réseau social ajouté.')
      setModal(false)
      load()
    } catch (e) {
      showToast(e.message || "Erreur lors de l'enregistrement", 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await del(`/admin/socials/${id}`)
      if (res.success) showToast('Réseau social supprimé.')
      else showToast(res.message || 'Erreur', 'error')
      load()
    } catch {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  const handleCloseModal = () => {
    if (iconPrev?.startsWith('blob:')) URL.revokeObjectURL(iconPrev)
    setModal(false)
    setIconPrev(null)
    setIconFile(null)
  }

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <AdminPage>
      <PageHeader
        title="Réseaux sociaux"
        subtitle="Gérez les liens et icônes affichés dans le footer du site"
        action={
          <Btn onClick={openCreate}>
            <Plus size={15} /> Ajouter un réseau
          </Btn>
        }
      />

      {loading ? <Spinner /> : (
        <Card>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <Share2 size={40} style={{ color: 'var(--border)', margin: '0 auto 1rem', display: 'block' }} />
              <p style={{ color: 'var(--text-3)', fontSize: '0.85rem' }}>Aucun réseau social configuré.</p>
              <Btn onClick={openCreate} style={{ marginTop: '1rem' }}>
                <Plus size={14} /> Ajouter un réseau
              </Btn>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', background: '#f8fafc' }}>
                  {['Réseau', 'Lien', 'Ordre', 'Statut', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-2)', fontSize: '0.71rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', textAlign: 'left', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.12s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Réseau */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          overflow: 'hidden',
                        }}>
                          {item.icon_url
                            ? <img
                                src={item.icon_url}
                                alt={item.name}
                                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                              />
                            : <ImageIcon size={20} style={{ color: 'var(--text-3)' }} />
                          }
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.87rem', color: 'var(--text)' }}>
                          {item.name}
                        </span>
                      </div>
                    </td>

                    {/* Lien */}
                    <td style={{ padding: '0.85rem 1rem', maxWidth: '220px' }}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--primary)', fontSize: '0.8rem', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                      >
                        {item.url}
                      </a>
                    </td>

                    {/* Ordre */}
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-3)', fontSize: '0.83rem' }}>
                      {item.order}
                    </td>

                    {/* Statut */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {item.is_active
                        ? <Badge color="green">Actif</Badge>
                        : <Badge color="gray">Inactif</Badge>
                      }
                    </td>

                    {/* Actions */}
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
          )}
        </Card>
      )}

      {/* ── Modal formulaire ─────────────────────────────── */}
      <Modal
        open={modal}
        onClose={handleCloseModal}
        title={editing ? 'Modifier le réseau' : 'Ajouter un réseau social'}
        width="460px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {/* ── Upload icône ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)' }}>
              {editing ? "Icône (laisser vide pour garder l'actuelle)" : 'Icône *'}
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${iconPrev ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                background: iconPrev ? '#f0fdf4' : '#fafafa',
                transition: 'all 0.2s',
                minHeight: '120px',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.background = '#f0fdf4'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = iconPrev ? 'var(--primary)' : 'var(--border)'
                e.currentTarget.style.background = iconPrev ? '#f0fdf4' : '#fafafa'
              }}
            >
              {iconPrev ? (
                <>
                  <div style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '14px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    <img
                      src={iconPrev}
                      alt="Aperçu"
                      style={{ width: '52px', height: '52px', objectFit: 'contain' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {iconFile ? iconFile.name : "Icône actuelle — cliquer pour changer"}
                  </span>
                </>
              ) : (
                <>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Upload size={20} style={{ color: 'var(--text-3)' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-2)', margin: 0 }}>
                      Cliquer pour choisir une icône
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', margin: '2px 0 0' }}>
                      PNG, JPG, SVG, WEBP — max 2 Mo
                    </p>
                  </div>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleIconChange}
              style={{ display: 'none' }}
            />
          </div>

          <Input
            label="Nom du réseau *"
            value={form.name}
            onChange={f('name')}
            placeholder="Ex: Facebook Salem Technology"
          />

          <Input
            label="URL du profil *"
            value={form.url}
            onChange={f('url')}
            placeholder="https://facebook.com/votre-page"
          />

          <Input
            label="Ordre d'affichage"
            type="number"
            value={form.order}
            onChange={(e) => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
            min="0"
          />

          {/* Prévisualisation footer */}
          <div style={{ padding: '0.85rem 1rem', background: '#1a1f3a', borderRadius: '10px' }}>
            <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Aperçu dans le footer
            </p>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {iconPrev
                ? <img src={iconPrev} alt="" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                : <ImageIcon size={18} style={{ color: 'rgba(255,255,255,0.3)' }} />
              }
            </div>
          </div>

          <Toggle
            label="Visible sur le site"
            checked={form.is_active}
            onChange={v => setForm(p => ({ ...p, is_active: v }))}
          />

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
            <Btn variant="ghost" onClick={handleCloseModal}>Annuler</Btn>
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
        title="Supprimer le réseau social"
        message="Ce réseau social et son icône seront définitivement supprimés du footer."
      />

      <Toast toast={toast} />
    </AdminPage>
  )
}