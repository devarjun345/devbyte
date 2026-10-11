import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { DevByteLogo } from '../components/brand/DevByteLogo'
import { EcosystemVisual } from '../components/marketing/EcosystemVisual'
import { ParallaxPanel } from '../components/marketing/ParallaxPanel'
import { Input } from '../components/ui'
import { MicroPress, Shake, useShakeTrigger } from '../components/ui'

type AccountRole = 'student' | 'mentor'

const passwordRules = [
  { label: 'At least 8 characters', test: (value: string) => value.length >= 8 },
  { label: 'One lowercase letter', test: (value: string) => /[a-z]/.test(value) },
  { label: 'One uppercase letter', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'One number', test: (value: string) => /\d/.test(value) },
  { label: 'One symbol', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
]

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.3 4.1 9 7-.2.9-.8 2-1.8 3.1M6.2 6.2C4 7.5 2.5 9.8 2 12c.7 2.9 4 7 10 7 1.4 0 2.6-.3 3.7-.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  ) : (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M2 12s3.3-7 10-7 10 7 10 7-3.3 7-10 7S2 12 2 12z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

export function SignupPage() {
  useEffect(() => {
    document.title = 'Create an account — DEV BYTE'
    return () => {
      document.title = 'DEV BYTE'
    }
  }, [])

  const [searchParams] = useSearchParams()
  const initialRole =
    searchParams.get('role') === 'mentor' ? 'mentor' : 'student'
  const [role, setRole] = useState<AccountRole>(initialRole)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [localValidationNotice, setLocalValidationNotice] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const reduceMotion = useReducedMotion()
  const { trigger: shakeTrigger, shake } = useShakeTrigger()

  const ruleResults = useMemo(
    () => passwordRules.map((rule) => ({ ...rule, satisfied: rule.test(password) })),
    [password],
  )
  const satisfiedCount = ruleResults.filter((rule) => rule.satisfied).length
  const strengthLabel =
    password.length === 0
      ? 'Not set'
      : satisfiedCount < 3
        ? 'Getting started'
        : satisfiedCount < 5
          ? 'Good'
          : 'Strong'
  const strengthClass =
    password.length === 0
      ? 'strength-empty'
      : satisfiedCount < 3
        ? 'strength-low'
        : satisfiedCount < 5
          ? 'strength-good'
          : 'strength-strong'

  const errors = {
    name: name.trim().length >= 2 ? '' : 'Enter your name (at least 2 characters).',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? ''
      : 'Enter a valid email address.',
    password:
      satisfiedCount === passwordRules.length
        ? ''
        : 'Meet all password requirements.',
    confirmation:
      confirmation.length > 0 && confirmation === password
        ? ''
        : 'Passwords must match.',
    terms: termsAccepted ? '' : 'Please agree before continuing.',
  }

  function shouldShowError(field: keyof typeof errors) {
    return (attemptedSubmit || touched[field]) && Boolean(errors[field])
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAttemptedSubmit(true)
    setLocalValidationNotice(false)
    const isValid =
      Object.values(errors).every((message) => message.length === 0) &&
      password.length > 0
    if (isValid) {
      setLocalValidationNotice(true)
    } else {
      shake()
    }
  }

  function markTouched(field: string) {
    setTouched((current) => ({ ...current, [field]: true }))
    setLocalValidationNotice(false)
  }

  return (
    <main className="signup-page">
      <header className="signup-header">
        <div className="signup-header-inner">
          <Link aria-label="DEV BYTE home" className="brand-mark" to="/">
            <DevByteLogo animated size={36} />
          </Link>
          <p>
            Already part of the journey? <Link to="/login">Log in</Link>
          </p>
        </div>
      </header>

      <div className="signup-layout">
        <motion.aside
          animate={{ opacity: 1, x: 0 }}
          className="signup-visual"
          initial={reduceMotion ? false : { opacity: 0, x: -18 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div aria-hidden="true" className="signup-visual-grain" />
          <ParallaxPanel className="signup-visual-parallax" amount={4}>
          <div className="signup-visual-top">
            <span className="signup-visual-mark">{'{ }'}</span>
            <span>A community for what’s next.</span>
          </div>
          <div className="signup-visual-copy">
            <p className="signup-visual-eyebrow">YOUR NEXT CHAPTER</p>
            <h1>
              Same curiosity.
              <br />
              <span>Bigger possibilities.</span>
            </h1>
            <p>
              Find your people, follow your questions, and see where your ideas
              can take you.
            </p>
          </div>
          <div className="signup-visual-art">
            <EcosystemVisual />
          </div>
          <p className="signup-visual-foot">There’s more than one way to grow.</p>
          </ParallaxPanel>
        </motion.aside>

        <section className="signup-form-side">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="signup-card"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="signup-heading">
              <span className="signup-step-label">A GOOD PLACE TO BEGIN</span>
              <h2>Create your account</h2>
              <p>Bring your curiosity. We’ll take it one step at a time.</p>
            </div>

            <Shake trigger={shakeTrigger}>
            <form className="signup-form" noValidate onSubmit={onSubmit}>
              <fieldset className="role-fieldset">
                <legend>I’m here as a</legend>
                <div className="role-options">
                  {(['student', 'mentor'] as const).map((option) => (
                    <MicroPress asChild key={option}>
                      <label
                        className={`role-option ${role === option ? 'is-selected' : ''}`}
                      >
                      <input
                        checked={role === option}
                        name="role"
                        onChange={() => {
                          setRole(option)
                          setLocalValidationNotice(false)
                        }}
                        type="radio"
                        value={option}
                      />
                      <span aria-hidden="true" className="role-option-icon">
                        {option === 'student' ? '↗' : '✳'}
                      </span>
                      <span className="role-option-copy">
                        <strong>{option === 'student' ? 'Student' : 'Mentor'}</strong>
                        <small>
                          {option === 'student'
                            ? 'Here to learn and build'
                            : 'Here to share and guide'}
                        </small>
                      </span>
                      <span aria-hidden="true" className="role-option-check">
                        {role === option ? '✓' : ''}
                      </span>
                    </label>
                    </MicroPress>
                  ))}
                </div>
              </fieldset>

              <Input
                autoComplete="name"
                error={shouldShowError('name') ? errors.name : undefined}
                label="Your name"
                name="name"
                onBlur={() => markTouched('name')}
                onChange={(event) => {
                  setName(event.target.value)
                  setLocalValidationNotice(false)
                }}
                placeholder="How should we call you?"
                required
                value={name}
              />
              <Input
                autoComplete="email"
                error={shouldShowError('email') ? errors.email : undefined}
                label="Email address"
                name="email"
                onBlur={() => markTouched('email')}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setLocalValidationNotice(false)
                }}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />

              <div className="signup-password-field">
                <div className="password-input-label">
                  <label htmlFor="signup-password">Create a password</label>
                  <span className={`strength-label ${strengthClass}`}>
                    {strengthLabel}
                  </span>
                </div>
                <div className="password-input-wrap">
                  <input
                    aria-describedby="password-feedback"
                    aria-errormessage={
                      shouldShowError('password')
                        ? 'signup-password-error'
                        : undefined
                    }
                    aria-invalid={
                      shouldShowError('password') ? true : undefined
                    }
                    autoComplete="new-password"
                    className="signup-password-input"
                    id="signup-password"
                    name="new-password"
                    onBlur={() => markTouched('password')}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setLocalValidationNotice(false)
                    }}
                    placeholder="Make it yours"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                  />
                  <button
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="password-visibility"
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
                <div
                  aria-label={`Password strength: ${strengthLabel}`}
                  className={`strength-meter ${strengthClass}`}
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={5}
                  aria-valuenow={satisfiedCount}
                >
                  {passwordRules.map((rule) => (
                    <span
                      className={ruleResults.find((result) => result.label === rule.label)?.satisfied ? 'is-filled' : ''}
                      key={rule.label}
                    />
                  ))}
                </div>
                <div className="password-requirements" id="password-feedback">
                  {ruleResults.map((rule) => (
                    <span
                      className={rule.satisfied ? 'requirement is-satisfied' : 'requirement'}
                      key={rule.label}
                    >
                      <span aria-hidden="true">
                        {rule.satisfied ? '✓' : '○'}
                      </span>
                      {rule.label}
                    </span>
                  ))}
                </div>
                {shouldShowError('password') && (
                  <p
                    className="signup-error-message"
                    id="signup-password-error"
                    role="alert"
                  >
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="signup-password-field">
                <label htmlFor="signup-confirmation">Confirm password</label>
                <div className="password-input-wrap">
                  <input
                    aria-invalid={
                      shouldShowError('confirmation') ? true : undefined
                    }
                    aria-errormessage={
                      shouldShowError('confirmation')
                        ? 'signup-confirmation-error'
                        : undefined
                    }
                    autoComplete="new-password"
                    className="signup-password-input"
                    id="signup-confirmation"
                    name="confirm-password"
                    onBlur={() => markTouched('confirmation')}
                    onChange={(event) => {
                      setConfirmation(event.target.value)
                      setLocalValidationNotice(false)
                    }}
                    placeholder="Type it once more"
                    required
                    type={showConfirmation ? 'text' : 'password'}
                    value={confirmation}
                  />
                  <button
                    aria-label={
                      showConfirmation
                        ? 'Hide confirmation password'
                        : 'Show confirmation password'
                    }
                    aria-pressed={showConfirmation}
                    className="password-visibility"
                    onClick={() =>
                      setShowConfirmation((visible) => !visible)
                    }
                    type="button"
                  >
                    <EyeIcon visible={showConfirmation} />
                  </button>
                </div>
                {shouldShowError('confirmation') && (
                  <p
                    className="signup-error-message"
                    id="signup-confirmation-error"
                    role="alert"
                  >
                    {errors.confirmation}
                  </p>
                )}
              </div>

              <div className="terms-field">
                <label className="terms-label">
                  <input
                    aria-describedby={
                      shouldShowError('terms') ? 'signup-terms-error' : undefined
                    }
                    checked={termsAccepted}
                    onBlur={() => markTouched('terms')}
                    onChange={(event) => {
                      setTermsAccepted(event.target.checked)
                      setLocalValidationNotice(false)
                    }}
                    type="checkbox"
                  />
                  <span aria-hidden="true" className="custom-checkbox">
                    {termsAccepted ? '✓' : ''}
                  </span>
                  <span>I agree to the terms and privacy policy.</span>
                </label>
                {shouldShowError('terms') && (
                  <p
                    className="signup-error-message"
                    id="signup-terms-error"
                    role="alert"
                  >
                    {errors.terms}
                  </p>
                )}
              </div>

              <MicroPress asChild>
              <button className="signup-submit" type="submit">
                <span>Continue as {role}</span>
                <span aria-hidden="true">↗</span>
              </button>
            </MicroPress>
              <p className="signup-local-note">
                Account creation isn’t connected yet. This form only checks
                your details in this browser.
              </p>
              {localValidationNotice && (
                <p className="signup-validation-notice" role="status">
                  Your details pass local validation. No account was created.
                </p>
              )}
              {attemptedSubmit &&
                !localValidationNotice &&
                Object.values(errors).some(Boolean) && (
                  <p className="signup-error-summary" role="status">
                    Check the highlighted fields to continue.
                  </p>
                )}
</form>
            </Shake>
           </motion.div>
          <p className="signup-side-link">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </section>
      </div>
    </main>
  )
}
