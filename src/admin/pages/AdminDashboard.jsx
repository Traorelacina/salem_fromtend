import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import {
  AdminPage, PageHeader, Card, StatCard, Badge, Btn,
  Spinner, TableHead, TableRow, Td, Toast,
} from '../components/AdminUI'
import {
  MessageSquare, Bell, Briefcase, Newspaper,
  Users, Layers, ArrowRight, Plus,
} from 'lucide-react'

export default function AdminDashboard() {
  const { get } = useApi()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats]       = useState(null)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      get('/admin/contacts/stats'),
      get('/admin/contacts?per_page=6'),
      get('/admin/portfolio'),
      get('/admin/news?per_page=1'),
      get('/admin/clients'),
    ]).then(([cStats, cList, port, news, clients]) => {
      setStats({
        contacts: cStats.data,
        portfolio: port.data?.length ?? 0,
        news: news.meta?.total ?? 0,
        clients: clients.data?.length ?? 0,
      })
      setContacts(cList.data ?? [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  const STATUS_BADGE = {
    new:      <Badge color="orange">Nouveau</Badge>,
    read:     <Badge color="blue">Lu</Badge>,
    replied:  <Badge color="green">Répondu</Badge>,
    archived: <Badge color="gray">Archivé</Badge>,
  }

  const quickActions = [
    { label: 'Nouvelle réalisation', to: '/admin/portfolio', Icon: Briefcase },
    { label: 'Nouvel article',       to: '/admin/news',      Icon: Newspaper },
  ]

  /* ── Statut messages config ──────────────────────────── */
  const statusRows = [
    { label: 'Nouveaux',  key: 'new',      badge: 'orange' },
    { label: 'Lus',       key: 'read',     badge: 'blue'   },
    { label: 'Répondus',  key: 'replied',  badge: 'green'  },
    { label: 'Archivés',  key: 'archived', badge: 'gray'   },
  ]

  return (
    <AdminPage>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0] ?? 'Admin'} 👋`}
        subtitle="Vue d'ensemble de Salem Technology"
      />

      {loading ? <Spinner /> : (
        <>
          {/* ── Stat cards ─────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}>
            <StatCard icon={MessageSquare} label="Total messages" value={stats?.contacts?.total ?? 0} color="blue"   />
            <StatCard icon={Bell}          label="Non lus"         value={stats?.contacts?.new   ?? 0} color="orange" trend="À traiter" />
            <StatCard icon={Briefcase}     label="Réalisations"    value={stats?.portfolio        ?? 0} color="purple" />
            <StatCard icon={Newspaper}     label="Articles"        value={stats?.news             ?? 0} color="green"  />
            <StatCard icon={Users}         label="Clients"         value={stats?.clients          ?? 0} color="green"  />
          </div>

          {/* ── Main grid ──────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 320px',
            gap: '1.25rem',
            alignItems: 'start',
          }}>

            {/* ── Messages récents ───────────────────── */}
            <Card>
              {/* Header */}
              <div style={{
                padding: '1.1rem 1.4rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc',
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              }}>
                <div>
                  <h3 style={{
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    color: 'var(--text)',
                    fontFamily: "'Lexend', sans-serif",
                  }}>
                    Messages récents
                  </h3>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.77rem', marginTop: '2px' }}>
                    Dernières demandes de contact
                  </p>
                </div>
                <Btn variant="ghost" size="sm" onClick={() => navigate('/admin/contacts')}
                  style={{ gap: '5px' }}>
                  Voir tous <ArrowRight size={13} />
                </Btn>
              </div>

              {/* Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <TableHead cols={['Expéditeur', 'Sujet', 'Date', 'Statut']} />
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{
                        padding: '3rem',
                        textAlign: 'center',
                        color: 'var(--text-3)',
                        fontSize: '0.85rem',
                      }}>
                        Aucun message
                      </td>
                    </tr>
                  ) : contacts.map(c => (
                    <TableRow
                      key={c.id}
                      onClick={() => navigate('/admin/contacts')}
                      highlight={c.status === 'new'}
                    >
                      {/* Expéditeur */}
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                          <div style={{
                            width: '32px', height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary-dk), var(--accent))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
                          }}>
                            {c.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{
                              fontWeight: c.status === 'new' ? 700 : 500,
                              fontSize: '0.84rem',
                              color: c.status === 'new' ? 'var(--text)' : 'var(--text-2)',
                            }}>
                              {c.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                              {c.email}
                            </div>
                          </div>
                        </div>
                      </Td>

                      {/* Sujet */}
                      <Td style={{ color: 'var(--text-2)', maxWidth: '220px' }}>
                        <div style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {c.subject}
                        </div>
                      </Td>

                      {/* Date */}
                      <Td style={{ color: 'var(--text-3)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {new Date(c.created_at).toLocaleDateString('fr-FR')}
                      </Td>

                      {/* Statut */}
                      <Td>
                        {STATUS_BADGE[c.status] ?? <Badge color="gray">{c.status}</Badge>}
                      </Td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* ── Colonne droite ─────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Actions rapides */}
              <Card style={{ padding: '1.25rem' }}>
                <h3 style={{
                  fontWeight: 700, fontSize: '0.9rem',
                  color: 'var(--text)', fontFamily: "'Lexend', sans-serif",
                  marginBottom: '0.9rem',
                }}>
                  Actions rapides
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {quickActions.map(({ label, to, Icon }) => (
                    <button
                      key={to}
                      onClick={() => navigate(to)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '0.65rem 0.85rem',
                        background: 'var(--bg)',
                        border: '1.5px solid var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        textAlign: 'left',
                        width: '100%',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background     = 'var(--primary-lt)'
                        e.currentTarget.style.borderColor    = 'var(--border-2)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background     = 'var(--bg)'
                        e.currentTarget.style.borderColor    = 'var(--border)'
                      }}
                    >
                      <div style={{
                        width: '30px', height: '30px',
                        borderRadius: '7px',
                        background: 'var(--bg-green-lt)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon size={14} style={{ color: 'var(--primary)' }} />
                      </div>
                      <span style={{
                        fontSize: '0.82rem', fontWeight: 600,
                        color: 'var(--text-2)', flex: 1,
                      }}>
                        {label}
                      </span>
                      <Plus size={13} style={{ color: 'var(--text-3)' }} />
                    </button>
                  ))}
                </div>
              </Card>

              {/* Statuts messages */}
              <Card style={{ padding: '1.25rem' }}>
                <h3 style={{
                  fontWeight: 700, fontSize: '0.9rem',
                  color: 'var(--text)', fontFamily: "'Lexend', sans-serif",
                  marginBottom: '0.9rem',
                }}>
                  Statuts messages
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {statusRows.map(({ label, key, badge }) => (
                    <div key={key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '7px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                    }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-2)' }}>
                        {label}
                      </span>
                      <Badge color={badge}>{stats?.contacts?.[key] ?? 0}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

            </div>
          </div>
        </>
      )}
    </AdminPage>
  )
}