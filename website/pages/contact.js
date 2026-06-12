import Head from 'next/head'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import PageHero from '@/components/PageHero'
import SectionHeader from '@/components/SectionHeader'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulated send — wire up to backend /api/communication or email service
    await new Promise((r) => setTimeout(r, 1000))
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <>
      <Head>
        <title>Contact Us — Ideal Vision Academy</title>
        <meta name="description" content="Get in touch with Ideal Vision Academy, Badaghat, Sunamganj. Call 01773-763422 or email idealvisionacademy@gmail.com." />
      </Head>

      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out anytime."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      <section className="py-16 bg-white">
        <div className="container-school">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <SectionHeader
                label="Reach Us"
                title="Get in Touch"
                subtitle="Contact us for admissions, queries or any information about our school."
                center={false}
              />

              <div className="space-y-6 mt-8">
                <a href="tel:01773763422" className="flex items-start gap-4 group">
                  <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-200 transition-colors">
                    <Phone className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Phone</p>
                    <p className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">01773-763422</p>
                    <p className="text-sm text-gray-500">Sat–Thu, 8:00 AM – 3:00 PM</p>
                  </div>
                </a>

                <a href="mailto:idealvisionacademy@gmail.com" className="flex items-start gap-4 group">
                  <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-200 transition-colors">
                    <Mail className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Email</p>
                    <p className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors break-all">
                      idealvisionacademy@gmail.com
                    </p>
                    <p className="text-sm text-gray-500">We reply within 24 hours</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Address</p>
                    <p className="font-bold text-gray-900">Badaghat, Sunamganj</p>
                    <p className="text-sm text-gray-500">Sunamganj District, Sylhet Division, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Office Hours</p>
                    <p className="font-bold text-gray-900">Saturday – Thursday</p>
                    <p className="text-sm text-gray-500">8:00 AM – 2:30 PM (School hours)</p>
                    <p className="text-sm text-gray-500">8:00 AM – 3:00 PM (Office hours)</p>
                  </div>
                </div>
              </div>

              {/* Quick CTA */}
              <div className="flex gap-3 mt-8">
                <a href="tel:01773763422" className="btn-primary flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
                <a href="mailto:idealvisionacademy@gmail.com" className="btn-outline flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Send Email
                </a>
              </div>

              {/* Map */}
              <div className="mt-8 rounded-2xl overflow-hidden bg-gray-100 h-56 flex items-center justify-center border border-gray-200">
                <div className="text-center text-gray-400">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Badaghat, Sunamganj</p>
                  <p className="text-xs mt-1">Google Map integration coming soon</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Send a Message</h2>
                <p className="text-sm text-gray-500 mb-6">Fill in the form and we'll get back to you soon.</p>

                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500 text-sm">Thank you for reaching out. We'll reply within 24 hours.</p>
                    <button
                      className="btn-outline mt-5"
                      onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', subject: '', message: '' }) }}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Your Name *</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Full name"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Phone</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="01XXXXXXXXX"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Subject *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="How can we help?"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Message *</label>
                      <textarea
                        required
                        rows={5}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white resize-none"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Write your message here..."
                      />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" /> Send Message
                        </span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
