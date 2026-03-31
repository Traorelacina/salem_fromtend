import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import {
  AdminPage, PageHeader, Card, Btn, Badge, Toggle,
  Modal, ConfirmDialog, Spinner, Input, Toast,
} from '../components/AdminUI'
import {
  Plus, Pencil, Trash2,
  Facebook, Linkedin, Instagram, Twitter,
  Youtube, Globe, Send, Music2, Share2,
} from 'lucide-react'

// ── Icônes disponibles ────────────────────────────────────────
const ICON_OPTIONS = [
  { value: 'facebook',  label: 'Facebook',  Icon: Facebook,  defaultColor: '#1877F2' },
  { value: 'linkedin',  label: 'LinkedIn',  Icon: Linkedin,  defaultColor: '#0A66C2' },
  { value: 'instagram', label: 'Instagram', Icon: Instagram, defaultColor: '#E1306C' },
  { value: 'twitter',   label: 'Twitter / X', Icon: Twitter, defaultColor: '#1DA1F2' },
  { value: 'youtube',   label: 'YouTube',   Icon: Youtube,   defaultColor: '#FF0000' },
  { value: 'tiktok',    label: 'TikTok',    Icon: Music2,    defaultColor: '#010101' },
  { value: 'telegram',  label: 'Telegram',  Icon: Send,      defaultColor: '#26A5E4' },
  { value: 'whatsapp',  label: 'WhatsApp',  Icon: Share2,    defaultColor: '#25D366' },
  { value: 'website',   label: 'Site web',  Icon: Globe,     defaultColor: '#6366F1' },
]

export function getSocialIcon(iconKey, size = 18) {
  const found = ICON_OPTIONS.find(o => o.value === iconKey)
  if (!found) return <Globe size={size} />
  const { Icon } = found
  return <Icon size={size} />
}

const EMPTY = { name: '', icon: 'facebook', url: '', color: '#1877F2', order: 0, is_active: true }

export default function AdminSocials() {
  const { get, post, put, del } = useApi()
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [saving,  setSaving]  = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [toast,   setToast]   = useState(null)

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
    setModal(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({
      name:      item.name,
      icon:      item.icon,
      url:       item.url,
      color:     item.color ?? '#1877F2',
      order:     item.order,
      is_active: item.is_active,
    })
    setModal(true)
  }

  // Quand on change d'icône, pré-remplir la couleur par défaut
  const handleIconChange = (iconValue) => {
    const opt = ICON_OPTIONS.find(o => o.value === iconValue)
    setForm(p => ({
      ...p,
      icon:  iconValue,
      name:  p.name || opt?.label || '',
      color: opt?.defaultColor || p.color,
    }))
  }

  const handleSave = async () => {
    if (!form.name || !form.url || !form.icon) {
      showToast('Veuillez remplir tous les champs obligatoires (*)', 'error')
      return
    }
    setSaving(true)
    try {
      let res
      if (editing) {
        res = await put(`/admin/socials/${editing.id}`, form)
      } else {
        res = await post('/admin/socials', form)
      }
      if (!res.success) throw new Error(res.message || 'Erreur')
      showToast(editing ? 'Réseau social mis à jour.' : 'Réseau social ajouté.')
      setModal(false)
      load()
    } catch (e) {
      showToast(e.message || 'Erreur lors de l\'enregistrement', 'error')
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

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <AdminPage>
      <PageHeader
        title="Réseaux sociaux"
        subtitle="Gérez les liens affichés dans le footer du site"
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
                  {['Réseau', 'Lien', 'Couleur', 'Ordre', 'Statut', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', color: 'var(--text-2)', fontSize: '0.71rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', textAlign: 'left', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const opt = ICON_OPTIONS.find(o => o.value === item.icon)
                  const Icon = opt?.Icon ?? Globe
                  return (
                    <tr
                      key={item.id}
                      style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.12s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Réseau */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: `${item.color ?? '#6366F1'}18`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <Icon size={18} style={{ color: item.color ?? '#6366F1' }} />
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

                      {/* Couleur */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: item.color ?? '#ccc', border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', fontFamily: 'monospace' }}>
                            {item.color ?? '—'}
                          </span>
                        </div>
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
                  )
                })}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {/* ── Modal formulaire ─────────────────────────────── */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Modifier le réseau' : 'Ajouter un réseau social'}
        width="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Sélecteur d'icône visuel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)' }}>
              Plateforme *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ICON_OPTIONS.map(opt => {
                const selected = form.icon === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleIconChange(opt.value)}
                    title={opt.label}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: `2px solid ${selected ? opt.defaultColor : 'var(--border)'}`,
                      background: selected ? `${opt.defaultColor}12` : '#fafafa',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      minWidth: '62px',
                    }}
                  >
                    <opt.Icon size={20} style={{ color: selected ? opt.defaultColor : 'var(--text-3)' }} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 600, color: selected ? opt.defaultColor : 'var(--text-3)', whiteSpace: 'nowrap' }}>
                      {opt.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <Input
            label="Nom affiché *"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Color picker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-2)' }}>
                Couleur de l'icône
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={f('color')}
                  style={{ width: '42px', height: '36px', border: '1.5px solid var(--border)', borderRadius: '7px', cursor: 'pointer', padding: '2px' }}
                />
                <Input
                  value={form.color}
                  onChange={f('color')}
                  placeholder="#1877F2"
                  style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}
                />
              </div>
            </div>

            <Input
              label="Ordre d'affichage"
              type="number"
              value={form.order}
              onChange={(e) => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
              min="0"
            />
          </div>

          {/* Prévisualisation */}
          {form.icon && (
            <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Aperçu dans le footer
              </p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: `${form.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${form.color}40`,
                }}>
                  {getSocialIcon(form.icon, 18)}
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 500 }}>
                  {form.name || 'Nom du réseau'}
                </span>
              </div>
            </div>
          )}

          <Toggle
            label="Visible sur le site"
            checked={form.is_active}
            onChange={v => setForm(p => ({ ...p, is_active: v }))}
          />

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Annuler</Btn>
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
        message="Ce réseau social sera retiré du footer du site."
      />

      <Toast toast={toast} />
    </AdminPage>
  )
}