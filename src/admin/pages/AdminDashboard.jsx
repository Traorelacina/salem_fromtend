import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../context/AuthContext'
import { AdminPage, PageHeader, Card, StatCard, Badge, Btn, Spinner, TableHead, TableRow, Td, Toast } from '../components/AdminUI'
import {
  MessageSquare, Bell, Briefcase, Newspaper,
  Users, Layers, ArrowRight, TrendingUp, Clock, CheckCircle2,
  Plus,
} from 'lucide-react'

export default function AdminDashboard() {
  const { get } = useApi()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

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

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  const STATUS_BADGE = {
    new:      <Badge color="orange">Nouveau</Badge>,
    read:     <Badge color="blue">Lu</Badge>,
    replied:  <Badge color="green">Répondu</Badge>,
    archived: <Badge color="gray">Archivé</Badge>,
  }

  // ✅ Actions rapides sans "Nouveau service"
  const quickActions = [
    { label: 'Nouvelle solution',    to: '/admin/solutions', Icon: Layers,    color: 'blue' },
    { label: 'Nouvelle réalisation', to: '/admin/portfolio', Icon: Briefcase, color: 'purple' },
    { label: 'Nouvel article',       to: '/admin/news',      Icon: Newspaper, color: 'orange' },
  ]

  return (
    <AdminPage>
      <PageHeader
        title={`${greeting}, ${user?.name?.split(' ')[0] ?? 'Admin'} 👋`}
        subtitle="Vue d'ensemble de Salem Technology"
      />

      {loading ? <Spinner /> : (
        <>
          {/* Stat cards - ✅ sans "Services" */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            <StatCard icon={MessageSquare} label="Total messages"  value={stats?.contacts?.total ?? 0} color="blue" />
            <StatCard icon={Bell}          label="Non lus"          value={stats?.contacts?.new ?? 0}   color="orange" trend="À traiter" />
            <StatCard icon={Briefcase}     label="Réalisations"     value={stats?.portfolio ?? 0}        color="purple" />
            <StatCard icon={Newspaper}     label="Articles"         value={stats?.news ?? 0}             color="green" />
            <StatCard icon={Users}         label="Clients"          value={stats?.clients ?? 0}          color="green" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', alignItems: 'start' }}>
            {/* Recent messages */}
            <Card>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(79,195,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'rgba(226,240,253,0.9)', fontFamily: "'Lexend', sans-serif" }}>Messages récents</h3>
                  <p style={{ color: 'rgba(186,230,253,0.4)', fontSize: '0.78rem', marginTop: '2px' }}>Dernières demandes de contact</p>
                </div>
                <Btn variant="ghost" size="sm" onClick={() => navigate('/admin/contacts')} style={{ gap: '5px' }}>
                  Voir tous <ArrowRight size={13} />
                </Btn>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <TableHead cols={['Expéditeur', 'Sujet', 'Date', 'Statut']} />
                <tbody>
                  {contacts.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'rgba(186,230,253,0.3)', fontSize: '0.85rem' }}>Aucun message</td></tr>
                  ) : contacts.map(c => (
                    <TableRow key={c.id} onClick={() => navigate('/admin/contacts')} highlight={c.status === 'new'}>
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                            {c.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: c.status === 'new' ? 700 : 500, fontSize: '0.84rem', color: c.status === 'new' ? 'white' : 'rgba(186,230,253,0.75)' }}>{c.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'rgba(186,230,253,0.35)' }}>{c.email}</div>
                          </div>
                        </div>
                      </Td>
                      <Td style={{ color: 'rgba(186,230,253,0.6)', maxWidth: '200px' }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</div>
                      </Td>
                      <Td style={{ color: 'rgba(186,230,253,0.35)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {new Date(c.created_at).toLocaleDateString('fr-FR')}
                      </Td>
                      <Td>{STATUS_BADGE[c.status] ?? <Badge color="gray">{c.status}</Badge>}</Td>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Quick actions - ✅ sans "Nouveau service" */}
              <Card style={{ padding: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.92rem', color: 'rgba(226,240,253,0.9)', fontFamily: "'Lexend', sans-serif", marginBottom: '1rem' }}>Actions rapides</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {quickActions.map(({ label, to, Icon }) => (
                    <button key={to} onClick={() => navigate(to)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.7rem 0.85rem', background: 'rgba(79,195,247,0.05)', border: '1px solid rgba(79,195,247,0.12)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,195,247,0.1)'; e.currentTarget.style.borderColor = 'rgba(79,195,247,0.25)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79,195,247,0.05)'; e.currentTarget.style.borderColor = 'rgba(79,195,247,0.12)' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'rgba(79,195,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={14} style={{ color: '#4fc3f7' }} />
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'rgba(186,230,253,0.8)', flex: 1 }}>{label}</span>
                      <Plus size={13} style={{ color: 'rgba(186,230,253,0.3)' }} />
                    </button>
                  ))}
                </div>
              </Card>

              {/* Messages summary */}
              <Card style={{ padding: '1.25rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '0.92rem', color: 'rgba(226,240,253,0.9)', fontFamily: "'Lexend', sans-serif", marginBottom: '1rem' }}>Statuts messages</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {[
                    { label: 'Nouveaux',  value: stats?.contacts?.new,      color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
                    { label: 'Lus',       value: stats?.contacts?.read,     color: '#4fc3f7', bg: 'rgba(79,195,247,0.12)' },
                    { label: 'Répondus',  value: stats?.contacts?.replied,  color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
                    { label: 'Archivés',  value: stats?.contacts?.archived, color: 'rgba(186,230,253,0.4)', bg: 'rgba(186,230,253,0.07)' },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.82rem', color: 'rgba(186,230,253,0.55)' }}>{label}</span>
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color, background: bg, padding: '0.15rem 0.6rem', borderRadius: '999px' }}>{value ?? 0}</span>
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
