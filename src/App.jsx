import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'

// ── Public components ──────────────────────────────────────
import Header         from './components/Header'
import Footer         from './components/Footer'
import PageHero       from './components/Pagehero'
import WhatsAppButton from './sections/WhatsAppButton'

import Hero            from './sections/Hero'
import About           from './sections/About'
import Services        from './sections/Services'
import Solutions       from './sections/Solutions'
import Portfolio       from './sections/Portfolio'
import News            from './sections/News'
import Contact         from './sections/Contact'
import SolutionDetail  from './sections/SolutionDetail'
import NewsDetail      from './sections/NewsDetail'
import PortfolioDetail from './sections/PortfolioDetail'

// ── Admin ──────────────────────────────────────────────────
import { AuthProvider }  from './admin/context/AuthContext'
import AdminLogin        from './admin/pages/AdminLogin'
import AdminLayout       from './admin/components/AdminLayout'
import ProtectedRoute    from './admin/components/ProtectedRoute'
import AdminDashboard    from './admin/pages/AdminDashboard'
import AdminServices     from './admin/pages/AdminServices'
import AdminSolutions    from './admin/pages/AdminSolutions'
import AdminPortfolio    from './admin/pages/AdminPortfolio'
import AdminClients      from './admin/pages/AdminClients'
import AdminNews         from './admin/pages/AdminNews'
import AdminContacts     from './admin/pages/AdminContacts'

// ── Scroll to top on every route change ──────────────────────
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

// ── AOS re-init on route change ──────────────────────────────
function AOSRefresh() {
  const { pathname } = useLocation()
  useEffect(() => { AOS.refresh() }, [pathname])
  return null
}

// ── Page wrapper : fade-in + mini-hero on inner pages ────────
function PageWrapper({ children, showPageHero = false }) {
  const { pathname } = useLocation()
  return (
    <div key={pathname} style={{ animation: 'pageFadeIn 0.4s ease forwards' }}>
      {showPageHero && <PageHero pathname={pathname} />}
      {children}
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Public layout wrapper ─────────────────────────────────
// WhatsAppButton est rendu ici → présent sur toutes les pages publiques
// mais absent des pages admin.
function PublicLayout({ children, showPageHero = false }) {
  return (
    <>
      <Header />
      <main>
        <PageWrapper showPageHero={showPageHero}>
          {children}
        </PageWrapper>
      </main>
      <Footer />

      {/* ── Bouton WhatsApp flottant ── */}
      <WhatsAppButton />
    </>
  )
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <AOSRefresh />
      <Routes>

        {/* ── PUBLIC ROUTES ────────────────────────────────── */}
        <Route path="/"          element={<PublicLayout><Hero /></PublicLayout>} />
        <Route path="/about"     element={<PublicLayout showPageHero><About /></PublicLayout>} />
        <Route path="/services"  element={<PublicLayout showPageHero><Services /></PublicLayout>} />
        <Route path="/solutions" element={<PublicLayout showPageHero><Solutions /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout showPageHero><Portfolio /></PublicLayout>} />
        <Route path="/news"      element={<PublicLayout showPageHero><News /></PublicLayout>} />
        <Route path="/contact"   element={<PublicLayout showPageHero><Contact /></PublicLayout>} />

        {/* Pages détail — ont leur propre Header/Footer/Hero intégrés */}
        <Route path="/news/:slug"       element={<><NewsDetail />      <WhatsAppButton /></>} />
        <Route path="/solutions/:slug"  element={<><SolutionDetail />  <WhatsAppButton /></>} />
        <Route path="/portfolio/:slug"  element={<><PortfolioDetail /> <WhatsAppButton /></>} />

        {/* ── ADMIN ROUTES ─────────────────────────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index             element={<AdminDashboard />} />
          <Route path="services"   element={<AdminServices />} />
          <Route path="solutions"  element={<AdminSolutions />} />
          <Route path="portfolio"  element={<AdminPortfolio />} />
          <Route path="clients"    element={<AdminClients />} />
          <Route path="news"       element={<AdminNews />} />
          <Route path="contacts"   element={<AdminContacts />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  useEffect(() => {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 80 })
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="font-poppins" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App