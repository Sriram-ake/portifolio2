import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Mail, Phone, Send } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { api, ApiError } from '@/services/api'
import { profile, profileVisibility } from '@/data/profile'
import { fadeUp, viewportOnce } from '@/animations/variants'
import { cn } from '@/lib/utils'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
  website: string // honeypot
}

interface FieldErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const initial: FormState = { name: '', email: '', subject: '', message: '', website: '' }

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) errors.email = 'Please enter your email.'
  else if (!EMAIL_RE.test(values.email)) errors.email = 'Please enter a valid email address.'
  if (!values.subject.trim()) errors.subject = 'Please enter a subject.'
  if (!values.message.trim()) errors.message = 'Please enter a message.'
  else if (values.message.trim().length < 10)
    errors.message = 'Message should be at least 10 characters.'
  else if (values.message.length > 2000) errors.message = 'Message is too long (max 2000).'
  return errors
}

export function Contact() {
  const [values, setValues] = useState<FormState>(initial)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverMessage, setServerMessage] = useState('')

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const validation = validate(values)
    setErrors(validation)
    if (Object.keys(validation).length > 0) {
      // Focus first invalid field for accessibility.
      const first = Object.keys(validation)[0]
      document.getElementById(`contact-${first}`)?.focus()
      return
    }

    setStatus('submitting')
    setServerMessage('')
    try {
      const res = await api.contact(values)
      setStatus('success')
      setServerMessage(res.message || 'Message sent successfully.')
      setValues(initial)
    } catch (err) {
      setStatus('error')
      setServerMessage(
        err instanceof ApiError && err.status === 429
          ? 'Too many messages. Please try again in a little while.'
          : 'Something went wrong. Please try again.',
      )
    }
  }

  const fieldClass = (hasError?: string) =>
    cn(
      'h-11 w-full rounded-lg border bg-card px-4 text-sm outline-none transition-colors focus:border-accent',
      hasError ? 'border-destructive' : 'border-border',
    )

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's connect"
      description="Have an opportunity, question, or just want to say hi? Send a message — it lands straight in my inbox."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        {/* Left: contact info */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce}>
          <div className="card-surface p-7">
            <h3 className="font-display text-lg font-semibold">Reach out directly</h3>
            <a
              href={`mailto:${profile.email}`}
              className="mt-4 flex items-center gap-2 text-accent transition-colors hover:underline"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {profile.email}
            </a>
            {profileVisibility.showPhone && (
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                className="mt-3 flex items-center gap-2 text-accent transition-colors hover:underline"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {profile.phone}
              </a>
            )}
            <p className="mt-6 text-sm text-muted-foreground">
              You'll also find me across these platforms:
            </p>
            <SocialLinks className="mt-4" />
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          onSubmit={handleSubmit}
          noValidate
          className="card-surface space-y-5 p-7"
        >
          {/* Honeypot (hidden from users, catches bots) */}
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input
              id="contact-website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={update('website')}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={update('name')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                className={fieldClass(errors.name)}
              />
              {errors.name && (
                <p id="contact-name-error" className="mt-1 text-xs text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={update('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                className={fieldClass(errors.email)}
              />
              {errors.email && (
                <p id="contact-email-error" className="mt-1 text-xs text-destructive">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-medium">
              Subject <span className="text-destructive">*</span>
            </label>
            <input
              id="contact-subject"
              type="text"
              value={values.subject}
              onChange={update('subject')}
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
              className={fieldClass(errors.subject)}
            />
            {errors.subject && (
              <p id="contact-subject-error" className="mt-1 text-xs text-destructive">
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">
              Message <span className="text-destructive">*</span>
            </label>
            <textarea
              id="contact-message"
              rows={5}
              value={values.message}
              onChange={update('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              className={cn(
                'w-full resize-y rounded-lg border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-accent',
                errors.message ? 'border-destructive' : 'border-border',
              )}
            />
            {errors.message && (
              <p id="contact-message-error" className="mt-1 text-xs text-destructive">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? (
                'Sending…'
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>

            {/* Live region for submit feedback */}
            <p aria-live="polite" className="text-sm">
              {status === 'success' && (
                <span className="inline-flex items-center gap-1.5 text-success">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  {serverMessage}
                </span>
              )}
              {status === 'error' && <span className="text-destructive">{serverMessage}</span>}
            </p>
          </div>
        </motion.form>
      </div>
    </Section>
  )
}
