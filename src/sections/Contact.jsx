import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'
import { fadeLeft, fadeRight } from '../animations/fadeAnimations'

// Même pattern que useApi.js → VITE_API_URL = http://localhost:8000/api
// Route complète : /api/v1/contact  →  VITE_API_URL + /v1/contact
const API = import.meta.env.VITE_API_URL ?? '/api'
const CONTACT_URL = `${API}/v1/contact`

const contactInfo = [
  {
    icon: MapPin,
    label: 'Adresse',
    value: "Abidjan, Côte d'Ivoire",
    sub: 'Riviera, Cocody',
    color: '#0D6EFD',
  },
  {
    icon: Phone,
    label: 'Téléphone',
    lines: [
      { display: '+225 07 08 42 55 01', href: 'tel:+2250708425501' },
      { display: '+225 07 08 22 19 01', href: 'tel:+2250708221901' },
      { display: '+225 05 04 59 47 69', href: 'tel:+2250504594769' },
    ],
    sub: 'Lun – Ven, 8h – 18h',
    color: '#00C2FF',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'salemtechnology2000@gmail.com',
    href: 'mailto:salemtechnology2000@gmail.com',
    sub: 'Réponse sous 24h',
    color: '#7C3AED',
  },
]

const INITIAL_FORM = { name: '', email: '', phone: '', company: '', subject: '', message: '' }

const Contact = () => {
  const [form, setForm]         = useState(INITIAL_FORM)
  const [sent, setSent]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})
  const [apiError, setApiError] = useState('')

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setApiError('')

    try {
      const res = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.status === 422) {
        const fieldErrors = {}
        Object.entries(data.errors ?? {}).forEach(([key, msgs]) => {
          fieldErrors[key] = Array.isArray(msgs) ? msgs[0] : msgs
        })
        setErrors(fieldErrors)
        return
      }

      if (!res.ok || !data.success) {
        setApiError(data.message ?? 'Une erreur est survenue. Veuillez réessayer.')
        return
      }

      setSent(true)
      setForm(INITIAL_FORM)
    } catch {
      setApiError('Impossible de joindre le serveur. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="section-padding bg-light">
      <Container>
        <SectionTitle
          subtitle="Contact"
          title="Travaillons ensemble"
          description="Vous avez un projet ? Discutons-en. Notre équipe est disponible pour étudier votre besoin et vous proposer la meilleure solution."
          center
        />

        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Left : Info + Map ── */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-6"
          >
            {contactInfo.map((info) => (
              <motion.div
                key={info.label}
                whileHover={{ x: 6 }}
                className="flex items-start gap-4 bg-white rounded-xl p-5 border border-gray-100 transition-all duration-300"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${info.color}15` }}
                >
                  <info.icon size={20} style={{ color: info.color }} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">{info.label}</p>

                  {info.lines ? (
                    <div className="flex flex-col gap-0.5">
                      {info.lines.map(l => (
                        <a key={l.href} href={l.href}
                          className="font-semibold text-dark text-sm hover:text-primary transition-colors">
                          {l.display}
                        </a>
                      ))}
                    </div>
                  ) : info.href ? (
                    <a href={info.href}
                      className="font-semibold text-dark text-sm hover:text-primary transition-colors break-all">
                      {info.value}
                    </a>
                  ) : (
                    <p className="font-semibold text-dark text-sm">{info.value}</p>
                  )}

                  <p className="text-gray-400 text-xs mt-0.5">{info.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Map */}
            <div
              className="rounded-2xl overflow-hidden border border-gray-100"
              style={{ height: 220, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
            >
              <iframe
                title="Salem Technology - Abidjan"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-3.9785,5.3364,-3.9385,5.3664&layer=mapnik"
                width="100%"
                height="220"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* ── Right : Form ── */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div
              className="bg-white rounded-2xl p-8"
              style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
            >
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2">Message envoyé !</h3>
                  <p className="text-gray-500 text-sm">
                    Merci pour votre message. Notre équipe vous contactera dans les 24h.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 text-sm text-primary font-semibold hover:underline"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-dark mb-6">Envoyez-nous un message</h3>

                  {apiError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                      {apiError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Nom + Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nom complet *</label>
                        <input
                          name="name" value={form.name} onChange={handleChange} required
                          placeholder="John Doe"
                          className={`form-input w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-all ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email *</label>
                        <input
                          name="email" type="email" value={form.email} onChange={handleChange} required
                          placeholder="john@example.com"
                          className={`form-input w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-all ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Téléphone + Société */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Téléphone</label>
                        <input
                          name="phone" value={form.phone} onChange={handleChange}
                          placeholder="+225 XX XX XX XX XX"
                          className={`form-input w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-all ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Société</label>
                        <input
                          name="company" value={form.company} onChange={handleChange}
                          placeholder="Votre entreprise"
                          className={`form-input w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-all ${errors.company ? 'border-red-400' : 'border-gray-200'}`}
                        />
                        {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                      </div>
                    </div>

                    {/* Sujet */}
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Sujet *</label>
                      <select
                        name="subject" value={form.subject} onChange={handleChange} required
                        className={`form-input w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-all appearance-none ${errors.subject ? 'border-red-400' : 'border-gray-200'}`}
                      >
                        <option value="">Choisir un sujet…</option>
                        <option>Site web</option>
                        <option>Application mobile</option>
                        <option>Logiciel de gestion</option>
                        <option>Réseaux informatiques</option>
                        <option>Marketing digital</option>
                        <option>Autre</option>
                      </select>
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Message *</label>
                      <textarea
                        name="message" value={form.message} onChange={handleChange} required
                        rows={5} placeholder="Décrivez votre projet…"
                        className={`form-input w-full px-4 py-3 rounded-xl border text-sm bg-gray-50 focus:bg-white transition-all resize-none ${errors.message ? 'border-red-400' : 'border-gray-200'}`}
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ y: -2, boxShadow: '0 10px 30px rgba(13,110,253,0.4)' }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-primary w-full justify-center py-4 text-sm"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2 justify-center">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Envoi en cours…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          <Send size={16} />
                          Envoyer le message
                        </span>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

export default Contact