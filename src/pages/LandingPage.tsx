import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'motion/react'
import {
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { Link } from 'react-router'
import { DevByteLogo } from '../components/brand/DevByteLogo'
import { EcosystemVisual } from '../components/marketing/EcosystemVisual'
import { MagneticLink } from '../components/marketing/MagneticLink'
import { ParallaxPanel } from '../components/marketing/ParallaxPanel'
import { Reveal } from '../components/marketing/Reveal'
import { MicroPress } from '../components/ui'

const features = [
  {
    id: 'opportunities',
    label: 'Find opportunities',
    title: 'Make room for the next big idea.',
    description:
      'Explore hackathons and learning opportunities that give your curiosity somewhere to go.',
    icon: '↗',
    accent: 'feature-accent-sage',
  },
  {
    id: 'teams',
    label: 'Build with others',
    title: 'Good work is rarely a solo project.',
    description:
      'Find teammates, share different strengths, and make ambitious projects feel achievable.',
    icon: '＋',
    accent: 'feature-accent-olive',
  },
  {
    id: 'practice',
    label: 'Practice deliberately',
    title: 'Turn practice into progress.',
    description:
      'Build problem-solving habits through focused coding challenges and assignments.',
    icon: '</>',
    accent: 'feature-accent-ink',
  },
  {
    id: 'mentorship',
    label: 'Learn together',
    title: 'A little guidance can change the path.',
    description:
      'Learn from peers and mentors as you work through new ideas and technical questions.',
    icon: '↗',
    accent: 'feature-accent-soft',
  },
]

const steps = [
  {
    number: '01',
    title: 'Start with what sparks you',
    body: 'Find a challenge, a topic, or a skill you want to grow.',
  },
  {
    number: '02',
    title: 'Bring people into the process',
    body: 'Meet collaborators and learn with people who bring different strengths.',
  },
  {
    number: '03',
    title: 'Keep building your craft',
    body: 'Practice, reflect, and take your next step at your own pace.',
  },
]

const navItems = [
  { label: 'Explore', href: '#explore' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For developers', href: '#for-developers' },
]

function BrandMark() {
  return (
    <Link
      aria-label="DEV BYTE home"
      className="brand-mark"
      to="/"
    >
      <DevByteLogo animated size={36} />
    </Link>
  )
}

function LandingNavigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    function updateScrollState() {
      setScrolled(window.scrollY > 16)
    }
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateScrollState)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <header className={`marketing-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="marketing-nav-wrap">
        <BrandMark />
        <nav aria-label="Main navigation" className="marketing-nav-desktop">
          {navItems.map((item) => (
            <a className="marketing-nav-link" href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="marketing-nav-actions">
          <Link className="nav-login-link" to="/login">
            Log in
          </Link>
          <MagneticLink className="nav-signup-link" to="/signup">
            Get started <span aria-hidden="true">↗</span>
          </MagneticLink>
        </div>
        <button
          aria-controls="mobile-marketing-nav"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span className={menuOpen ? 'menu-bar menu-bar-open-one' : 'menu-bar'} />
          <span className={menuOpen ? 'menu-bar menu-bar-open-two' : 'menu-bar'} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            animate={{ opacity: 1, height: 'auto' }}
            aria-label="Mobile navigation"
            className="mobile-marketing-nav"
            exit={{ opacity: 0, height: 0 }}
            id="mobile-marketing-nav"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
          >
            {navItems.map((item, index) => (
              <motion.a
                animate={{ opacity: 1, x: 0 }}
                className="mobile-nav-link"
                href={item.href}
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                key={item.href}
                onClick={() => setMenuOpen(false)}
                transition={{ delay: reduceMotion ? 0 : index * 0.04 }}
              >
                {item.label}
                <span aria-hidden="true">↗</span>
              </motion.a>
            ))}
            <Link
              className="mobile-nav-cta"
              onClick={() => setMenuOpen(false)}
              to="/signup"
            >
              Create your account <span aria-hidden="true">↗</span>
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function HeroSection() {
  const reduceMotion = useReducedMotion()
  const words = ['Build.', 'Collaborate.', 'Learn.', 'Grow']

  return (
    <section className="landing-hero">
      <div aria-hidden="true" className="hero-grid" />
      <div aria-hidden="true" className="hero-ambient hero-ambient-left" />
      <div aria-hidden="true" className="hero-ambient hero-ambient-right" />
      <div className="landing-container hero-layout">
        <div className="hero-copy">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="hero-eyebrow"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            <span aria-hidden="true" className="eyebrow-spark">
              ✳
            </span>
            A home for curious developers
          </motion.div>
          <h1 className="hero-title" aria-label="Build. Collaborate. Learn. Grow Together.">
            <span className="hero-title-row">
              {words.slice(0, 3).map((word, index) => (
                <motion.span
                  animate={{ opacity: 1, y: 0 }}
                  className="hero-title-word"
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  key={word}
                  transition={{
                    delay: reduceMotion ? 0 : 0.16 + index * 0.09,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <motion.span
              animate={{ opacity: 1, y: 0 }}
              className="hero-title-last"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              transition={{
                delay: reduceMotion ? 0 : 0.48,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="hero-title-accent">Grow Together.</span>
            </motion.span>
          </h1>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="hero-description"
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6, delay: 0.58 }}
          >
            Your developer journey, with more room to grow. Find opportunities,
            build with others, practice your craft, and learn along the way.
          </motion.p>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="hero-actions"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            transition={{ duration: 0.6, delay: 0.68 }}
          >
            <MagneticLink className="button-primary hero-primary" to="/signup">
              Get started <span className="button-arrow" aria-hidden="true">↗</span>
            </MagneticLink>
            <MicroPress asChild>
              <a className="button-secondary" href="#how-it-works">
                See how it works <span aria-hidden="true">↓</span>
              </a>
            </MicroPress>
          </motion.div>
          <motion.p
            animate={{ opacity: 1 }}
            className="hero-footnote"
            initial={reduceMotion ? false : { opacity: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            A thoughtful space for the work you want to do.
          </motion.p>
        </div>
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="hero-art-wrap"
          initial={
            reduceMotion
              ? false
              : { opacity: 0, scale: 0.96, y: 18 }
          }
          transition={{ duration: 0.9, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <ParallaxPanel className="hero-art-panel" amount={5}>
            <div className="hero-art-topline">
              <span className="hero-art-kicker">THE DEV BYTE ECOSYSTEM</span>
              <span className="hero-art-index">01 / 04</span>
            </div>
            <EcosystemVisual />
            <div className="hero-art-footer">
              <span>Find your next direction.</span>
              <span aria-hidden="true">↗</span>
            </div>
            <div aria-hidden="true" className="hero-sticker">
              <span>Ideas</span>
              <span className="hero-sticker-star">✳</span>
              <span>in motion</span>
            </div>
          </ParallaxPanel>
          <div aria-hidden="true" className="hero-side-note">
            <span className="hero-side-note-line" />
            FOR THE MAKERS
          </div>
        </motion.div>
      </div>
      <a className="scroll-cue" href="#explore">
        <span aria-hidden="true" className="scroll-cue-line" />
        Scroll to explore
      </a>
    </section>
  )
}

function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)
  const reduceMotion = useReducedMotion()
  const feature = features[activeFeature]

  function handleTabKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | undefined
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % features.length
    if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + features.length) % features.length
    }
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = features.length - 1
    if (nextIndex === undefined) return
    event.preventDefault()
    setActiveFeature(nextIndex)
    document.getElementById(`feature-tab-${features[nextIndex].id}`)?.focus()
  }

  return (
    <section className="section-shell feature-section" id="explore">
      <div className="landing-container">
        <Reveal className="section-heading-row">
          <div>
            <p className="section-eyebrow">THE WHOLE JOURNEY, IN VIEW</p>
            <h2 className="section-title">
              One place to keep
              <br className="desktop-break" /> moving forward.
            </h2>
          </div>
          <p className="section-intro">
            From the first “what if?” to the finished project, make space for
            every part of becoming a developer.
          </p>
        </Reveal>

        <Reveal className="showcase-frame" delay={0.08}>
          <div aria-label="Explore DEV BYTE areas" className="showcase-tabs" role="tablist">
            {features.map((item, index) => (
              <button
                aria-controls={`feature-panel-${item.id}`}
                aria-selected={activeFeature === index}
                className={`showcase-tab ${activeFeature === index ? 'is-active' : ''}`}
                id={`feature-tab-${item.id}`}
                key={item.id}
                onClick={() => setActiveFeature(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                role="tab"
                tabIndex={activeFeature === index ? 0 : -1}
                type="button"
              >
                <span className="showcase-tab-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
          <div className="showcase-content">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                aria-labelledby={`feature-tab-${feature.id}`}
                className="showcase-feature-copy"
                exit={{ opacity: 0, x: -12 }}
                id={`feature-panel-${feature.id}`}
                initial={reduceMotion ? false : { opacity: 0, x: 12 }}
                key={feature.id}
                role="tabpanel"
                transition={{ duration: reduceMotion ? 0 : 0.24 }}
              >
                <p className="showcase-overline">A LITTLE MORE {feature.label.toUpperCase()}</p>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <MicroPress asChild>
                <Link className="text-link" to="/signup">
                  Explore your possibilities <span aria-hidden="true">↗</span>
                </Link>
              </MicroPress>
              </motion.div>
            </AnimatePresence>
            <div
              aria-hidden="true"
              className={`showcase-art ${feature.accent}`}
            >
              <div className="showcase-art-index">DEV BYTE / {String(activeFeature + 1).padStart(2, '0')}</div>
              <div className="showcase-art-orbit orbit-one" />
              <div className="showcase-art-orbit orbit-two" />
              <motion.div
                animate={reduceMotion ? undefined : { rotate: [0, 4, 0] }}
                className="showcase-art-card"
                key={feature.id}
                transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
              >
                <span className="showcase-art-symbol">{feature.icon}</span>
                <span className="showcase-art-rule" />
                <span className="showcase-art-label">{feature.label}</span>
                <span className="showcase-art-subline">A new path takes shape.</span>
              </motion.div>
              <span className="showcase-art-star star-one">✳</span>
              <span className="showcase-art-star star-two">·</span>
            </div>
          </div>
        </Reveal>
        <div className="feature-strip">
          {features.map((item, index) => (
            <Reveal delay={index * 0.06} key={item.id}>
              <MicroPress asChild>
                <button
                  aria-label={`Show ${item.label}`}
                  className={`feature-strip-item ${activeFeature === index ? 'is-current' : ''}`}
                  onClick={() => {
                    setActiveFeature(index)
                    document
                      .getElementById('explore')
                      ?.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth' })
                  }}
                  type="button"
                >
                  <span className="feature-strip-number">0{index + 1}</span>
                  <span>{item.label}</span>
                  <span aria-hidden="true">↗</span>
                </button>
              </MicroPress>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="section-shell process-section" id="how-it-works">
      <div className="landing-container process-layout">
        <Reveal className="process-intro">
          <p className="section-eyebrow">A SIMPLE PLACE TO BEGIN</p>
          <h2 className="section-title">
            Your next step
            <br /> starts somewhere.
          </h2>
          <p className="section-intro">
            No perfect plan required. Follow your interests, meet your people,
            and let the learning add up.
          </p>
          <MicroPress asChild>
            <Link className="text-link" to="/signup">
              Take your first step <span aria-hidden="true">↗</span>
            </Link>
          </MicroPress>
        </Reveal>
        <div className="process-steps">
          {steps.map((step, index) => (
            <Reveal className="process-step-wrap" delay={index * 0.1} key={step.number}>
              <article className="process-step">
                <span className="process-step-number">{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
                <span aria-hidden="true" className="process-step-arrow">
                  ↗
                </span>
              </article>
              {index < steps.length - 1 && (
                <div aria-hidden="true" className="process-connector">
                  <span />
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function AudienceSection() {
  return (
    <section className="section-shell audience-section" id="for-developers">
      <div className="landing-container">
        <Reveal className="audience-heading">
          <p className="section-eyebrow">GOOD THINGS GROW IN COMMUNITY</p>
          <h2 className="section-title">
            For wherever
            <br /> you are in the journey.
          </h2>
        </Reveal>
        <div className="audience-grid">
          <Reveal>
            <ParallaxPanel className="audience-card audience-card-students" amount={3}>
              <div className="audience-card-meta">
                <span>01 — FOR STUDENTS</span>
                <span aria-hidden="true">✳</span>
              </div>
              <div aria-hidden="true" className="audience-card-illustration student-illustration">
                <span className="illustration-sun" />
                <span className="illustration-path" />
                <span className="illustration-leaf leaf-one" />
                <span className="illustration-leaf leaf-two" />
                <span className="illustration-terminal">{'{ }'}</span>
              </div>
              <h3>Build the kind of future you can’t wait to meet.</h3>
              <p>
                Find challenges, meet collaborators, and make your learning
                visible through the things you build.
              </p>
              <MicroPress asChild>
                <Link className="audience-link" to="/signup?role=student">
                  Join as a student <span aria-hidden="true">↗</span>
                </Link>
              </MicroPress>
            </ParallaxPanel>
          </Reveal>
          <Reveal delay={0.12}>
            <ParallaxPanel className="audience-card audience-card-mentors" amount={3}>
              <div className="audience-card-meta">
                <span>02 — FOR MENTORS</span>
                <span aria-hidden="true">↗</span>
              </div>
              <div aria-hidden="true" className="audience-card-illustration mentor-illustration">
                <span className="mentor-sun" />
                <span className="mentor-arch arch-one" />
                <span className="mentor-arch arch-two" />
                <span className="mentor-quote">“Keep going.”</span>
              </div>
              <h3>Pass on the things you wish you’d known.</h3>
              <p>
                Share perspective, help a new idea find its footing, and give
                back to the community you’re part of.
              </p>
              <MicroPress asChild>
                <Link className="audience-link" to="/signup?role=mentor">
                  Join as a mentor <span aria-hidden="true">↗</span>
                </Link>
              </MicroPress>
            </ParallaxPanel>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function FinalCallToAction() {
  return (
    <section className="final-cta-section" id="join">
      <Reveal className="landing-container">
        <div className="final-cta">
          <div aria-hidden="true" className="final-cta-decoration">
            <span className="cta-ring cta-ring-one" />
            <span className="cta-ring cta-ring-two" />
            <span className="cta-spark">✳</span>
          </div>
          <div className="final-cta-copy">
            <p className="section-eyebrow">MAKE SOMETHING OF YOUR CURIOSITY</p>
            <h2>There’s more than one way to grow.</h2>
            <p>
              Bring your ideas, your questions, and the skills you’re still
              figuring out. There’s room to start here.
            </p>
          </div>
          <MagneticLink className="button-light" to="/signup">
            Find your way in <span aria-hidden="true">↗</span>
          </MagneticLink>
        </div>
      </Reveal>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-container footer-layout">
        <div className="footer-brand-block">
          <BrandMark />
          <p>A little more room to become who you’re becoming.</p>
        </div>
        <div className="footer-links">
          <a href="#explore">Explore</a>
          <a href="#how-it-works">How it works</a>
          <Link to="/signup">Create account</Link>
          <Link to="/login">Log in</Link>
        </div>
        <div className="footer-bottom">
          <span>Made for curious minds.</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  useEffect(() => {
    document.title = 'DEV BYTE — Build. Collaborate. Learn. Grow Together.'
    return () => {
      document.title = 'DEV BYTE'
    }
  }, [])

  return (
    <main className="marketing-page" id="top">
      <LandingNavigation />
      <HeroSection />
      <FeatureShowcase />
      <HowItWorks />
      <AudienceSection />
      <FinalCallToAction />
      <LandingFooter />
    </main>
  )
}
