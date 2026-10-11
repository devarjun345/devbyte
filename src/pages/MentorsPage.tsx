import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { Button, Card, EmptyState, Input } from '../components/ui'
import { EmptyResults, FeatureBackLink, FeaturePage, FeatureTag, SectionTitle, StatusNotice } from '../components/features/FeatureUI'
import { Shake, useShakeTrigger } from '../components/ui'
import { bookingDates, demoMentors, mentorDemoSlots, mentorSessions, type DemoMentor } from './phase6-demo-data'

const categories = [...new Set(demoMentors.map((mentor) => mentor.category))]
const levels = [...new Set(demoMentors.map((mentor) => mentor.level))]

function MentorCard({ mentor, index }: { index: number; mentor: DemoMentor }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.article
      className="mentor-card"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, delay: reduceMotion ? 0 : index * 0.05 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="mentor-card-top">
        <span aria-hidden="true" className="mentor-avatar">{mentor.name.split(' ').map((part) => part[0]).join('')}</span>
        <span className="mentor-sample-rating" aria-label={`${mentor.rating} illustrative rating, ${mentor.reviewCount} sample reviews`}>★ {mentor.rating.toFixed(1)} <small>({mentor.reviewCount} sample reviews)</small></span>
      </div>
      <h2>{mentor.name}</h2>
      <p className="mentor-role">{mentor.role}</p>
      <div className="mentor-card-facts"><span>{mentor.experience} years · illustrative experience</span><span>{mentor.level} level · sample</span></div>
      <div className="mentor-card-skills">{mentor.skills.map((skill) => <FeatureTag key={skill}>{skill}</FeatureTag>)}</div>
      <p className="mentor-card-intro">{mentor.introduction}</p>
      <Link className="feature-card-link" to={`/discover/mentors/${mentor.id}`}>View mentor profile <span aria-hidden="true">↗</span></Link>
    </motion.article>
  )
}

function MentorProfile({ mentor }: { mentor: DemoMentor }) {
  const related = demoMentors.filter((item) => item.id !== mentor.id && item.category === mentor.category).concat(
    demoMentors.filter((item) => item.id !== mentor.id && item.category !== mentor.category),
  ).slice(0, 2)

  return (
    <FeaturePage
      actions={<><FeatureBackLink to="/discover/mentors">All mentors</FeatureBackLink><Link className="feature-button-link" to={`/discover/mentors/${mentor.id}/book`}>Book a session <span aria-hidden="true">↗</span></Link></>}
      description={mentor.introduction}
      eyebrow={`${mentor.category} · FICTIONAL MENTOR`}
      title={mentor.name}
    >
      <div className="mentor-profile-grid">
        <div className="mentor-profile-main">
          <Card className="mentor-profile-overview">
            <div className="mentor-profile-identity"><span aria-hidden="true" className="mentor-avatar mentor-avatar-large">{mentor.name.split(' ').map((part) => part[0]).join('')}</span><div><p className="feature-eyebrow">SAMPLE PROFILE</p><h2>{mentor.role}</h2><p>{mentor.experience} years of illustrative experience · {mentor.level}</p></div></div>
            <p className="mentor-profile-background">{mentor.background}</p>
            <div className="mentor-card-skills">{mentor.skills.map((skill) => <FeatureTag key={skill}>{skill}</FeatureTag>)}</div>
            <div className="mentor-profile-rating"><strong>★ {mentor.rating.toFixed(1)}</strong><span>{mentor.reviewCount} sample reviews · illustrative ratings only, not verified feedback.</span></div>
          </Card>
          <Card>
            <SectionTitle eyebrow="SAMPLE WORK" title="Project highlights" />
            <div className="mentor-highlight-list">{mentor.highlights.map((item) => <article key={item.title}><span aria-hidden="true">↗</span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>
          </Card>
        </div>
        <aside className="mentor-profile-side">
          <Card>
            <SectionTitle eyebrow="ILLUSTRATIVE TIMES" title="Availability preview" />
            <p className="mentor-side-note">These example slots are not connected to a calendar.</p>
            <ul className="mentor-availability-list">{mentor.availability.map((slot) => <li key={slot}><span aria-hidden="true">◷</span>{slot}</li>)}</ul>
            <Link className="feature-button-link mentor-book-link" to={`/discover/mentors/${mentor.id}/book`}>Book a session <span aria-hidden="true">↗</span></Link>
          </Card>
          <Card className="mentor-profile-disclaimer"><p className="feature-eyebrow">DEMO CONTENT</p><p>Mentor identities, experience, portfolio highlights, review counts, and availability are fictional examples.</p></Card>
        </aside>
      </div>
      <section className="mentor-related"><SectionTitle eyebrow="MORE SAMPLE PROFILES" title="Related mentors" /><div className="mentor-related-grid">{related.map((item) => <Link key={item.id} to={`/discover/mentors/${item.id}`}><span className="mentor-avatar">{item.name.split(' ').map((part) => part[0]).join('')}</span><span><strong>{item.name}</strong><small>{item.category} · sample</small></span><span aria-hidden="true">↗</span></Link>)}</div></section>
    </FeaturePage>
  )
}

function BookingFlow({ mentor }: { mentor: DemoMentor }) {
  const reduceMotion = useReducedMotion()
  const [session, setSession] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [step, setStep] = useState<'select' | 'review' | 'confirmed'>('select')
  const { trigger, shake } = useShakeTrigger()

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!session) nextErrors.session = 'Choose a sample session format.'
    if (!date) nextErrors.date = 'Choose an illustrative date.'
    if (!time) nextErrors.time = 'Choose an illustrative time.'
    if (note.trim().length < 15) nextErrors.note = 'Add at least 15 characters about your mentorship goal.'
    setErrors(nextErrors)
    const isValid = Object.keys(nextErrors).length === 0
    if (isValid) setStep('review')
    else shake()
  }

  const sessionInfo = mentorSessions.find((item) => String(item.duration) === session)

  return (
    <FeaturePage
      actions={<FeatureBackLink to={`/discover/mentors/${mentor.id}`}>Mentor profile</FeatureBackLink>}
      description={`Choose a sample format and describe what you would like to explore with ${mentor.name}.`}
      eyebrow="MENTORSHIP · BOOKING PREVIEW"
      title="Plan a session"
    >
      <Card className="mentor-booking-card">
        <div className="mentor-booking-person"><span className="mentor-avatar">{mentor.name.split(' ').map((part) => part[0]).join('')}</span><div><strong>{mentor.name}</strong><small>{mentor.role}</small></div></div>
        <p className="mentor-booking-notice">This is a frontend-only booking preview. No calendar, payment, email, or network request is connected.</p>
        <AnimatePresence mode="wait" initial={false}>
          {step === 'select' && <motion.form className="mentor-booking-form" key="select" noValidate onSubmit={review} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.16 }}>
            <Shake trigger={trigger}>
            <label className="feature-select-label">Session format
              <select aria-describedby={errors.session ? 'booking-session-error' : undefined} aria-invalid={Boolean(errors.session)} onChange={(event) => setSession(event.target.value)} value={session}><option value="">Choose a session</option>{mentorSessions.map((item) => <option key={item.duration} value={item.duration}>{item.duration} minutes · {item.label}</option>)}</select>
              {errors.session && <span className="feature-field-error" id="booking-session-error">{errors.session}</span>}
            </label>
            <label className="feature-select-label">Illustrative date
              <select aria-describedby={errors.date ? 'booking-date-error' : undefined} aria-invalid={Boolean(errors.date)} onChange={(event) => setDate(event.target.value)} value={date}><option value="">Choose a sample date</option>{bookingDates.map((item) => <option key={item}>{item}</option>)}</select>
              {errors.date && <span className="feature-field-error" id="booking-date-error">{errors.date}</span>}
            </label>
            <fieldset className="mentor-time-fieldset"><legend>Illustrative time · local preview only</legend><div className="mentor-time-options">{mentorDemoSlots.map((item) => <button aria-pressed={time === item} className={time === item ? 'is-selected' : ''} key={item} onClick={() => setTime(item)} type="button">{item}</button>)}</div>{errors.time && <span className="feature-field-error" role="alert">{errors.time}</span>}</fieldset>
            <label className="feature-select-label mentor-booking-note">What would you like mentorship on?
              <textarea aria-describedby={errors.note ? 'booking-note-error' : 'booking-note-help'} aria-invalid={Boolean(errors.note)} maxLength={400} onChange={(event) => setNote(event.target.value)} placeholder="Share a topic or goal to help shape the conversation." rows={4} value={note} />
              <span className={errors.note ? 'feature-field-error' : 'feature-field-hint'} id={errors.note ? 'booking-note-error' : 'booking-note-help'}>{errors.note ?? `${note.length}/400 · at least 15 characters`}</span>
            </label>
            <Button type="submit">Review session preview <span aria-hidden="true">→</span></Button>
          </Shake>
          </motion.form>}
          {step === 'review' && <motion.section aria-labelledby="booking-review-title" className="mentor-booking-review" key="review" initial={reduceMotion ? false : { opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={reduceMotion ? undefined : { opacity: 0, x: -8 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
            <p className="feature-eyebrow">CHECK YOUR SELECTIONS</p><h2 id="booking-review-title">Session summary preview</h2>
            <dl className="mentor-booking-summary"><div><dt>Mentor</dt><dd>{mentor.name} · sample profile</dd></div><div><dt>Format</dt><dd>{sessionInfo?.duration} minutes · {sessionInfo?.label}</dd></div><div><dt>Date & time</dt><dd>{date} · {time}</dd></div><div><dt>Goal note</dt><dd>{note}</dd></div></dl>
            <p className="mentor-booking-notice">Review only: confirming below will show a local demo state. Nothing is booked, sent, or saved.</p>
            <div className="mentor-booking-actions"><Button onClick={() => setStep('select')} variant="outline">Edit selections</Button><Button onClick={() => setStep('confirmed')}>Show confirmation preview</Button></div>
          </motion.section>}
          {step === 'confirmed' && <motion.section aria-labelledby="booking-preview-title" className="mentor-booking-confirmed" key="confirmed" initial={reduceMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
            <StatusNotice title="Local confirmation preview">No session has actually been booked. No calendar event, payment, email, or server record was created.</StatusNotice>
            <h2 id="booking-preview-title">Your preview</h2><p>{sessionInfo?.duration} minutes with {mentor.name} · {date} at {time}</p><p className="mentor-booking-goal">{note}</p>
            <div className="mentor-booking-actions"><Button onClick={() => setStep('select')} variant="outline">Modify selections</Button><Link className="feature-secondary-link" to={`/discover/mentors/${mentor.id}`}>Return to profile</Link></div>
          </motion.section>}
        </AnimatePresence>
      </Card>
    </FeaturePage>
  )
}

export function MentorsPage() {
  const { mentorId } = useParams()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState('')
  const [availability, setAvailability] = useState('')
  const [sort, setSort] = useState('recommended')
  const isBooking = location.pathname.endsWith('/book')
  const mentor = demoMentors.find((item) => item.id === mentorId)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const matches = demoMentors
      .filter((item) => !term || [item.name, item.role, item.category, item.background, ...item.skills].join(' ').toLowerCase().includes(term))
      .filter((item) => !category || item.category === category)
      .filter((item) => !level || item.level === level)
      .filter((item) => !availability || item.availability.some((slot) => slot.toLowerCase().startsWith(availability.toLowerCase())))
    return matches.sort((a, b) => sort === 'experience' ? b.experience - a.experience : sort === 'rating' ? b.rating - a.rating : demoMentors.indexOf(a) - demoMentors.indexOf(b))
  }, [availability, category, level, query, sort])

  if (mentorId) {
    if (!mentor) return <FeaturePage description="That mentor is not included in the local sample directory." eyebrow="NOT FOUND" title="Mentor unavailable"><EmptyState description="Return to mentor discovery and choose a fictional sample profile." title="No matching mentor" action={<Link className="feature-card-link" to="/discover/mentors">Browse mentor previews</Link>} /></FeaturePage>
    return isBooking ? <BookingFlow mentor={mentor} /> : <MentorProfile mentor={mentor} />
  }

  function clearFilters() {
    setQuery('')
    setCategory('')
    setLevel('')
    setAvailability('')
    setSort('recommended')
  }

  return (
    <FeaturePage description="Explore fictional mentors by focus area and experience. Profiles, review counts, ratings, and availability are illustrative—not verified people or open appointments." eyebrow="DISCOVER · MENTOR PREVIEWS" title="Learn with a mentor">
      <Card className="feature-filter-panel">
        <div className="feature-filter-heading"><div><strong>Find a mentor</strong><span>Search by name, role, skill, or expertise</span></div><Button onClick={clearFilters} variant="ghost">Clear all</Button></div>
        <div className="feature-filter-grid mentor-filter-grid">
          <Input aria-label="Search mentors" label="Search" onChange={(event) => setQuery(event.target.value)} placeholder="Name, expertise, or skill" type="search" value={query} />
          <label className="feature-select-label">Expertise<select aria-label="Filter mentors by expertise" onChange={(event) => setCategory(event.target.value)} value={category}><option value="">All expertise</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="feature-select-label">Experience<select aria-label="Filter mentors by experience" onChange={(event) => setLevel(event.target.value)} value={level}><option value="">Any level</option>{levels.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="feature-select-label">Sample availability<select aria-label="Filter by sample availability" onChange={(event) => setAvailability(event.target.value)} value={availability}><option value="">Any sample slot</option><option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option><option>Sun</option></select></label>
          <label className="feature-select-label">Sort<select aria-label="Sort mentors" onChange={(event) => setSort(event.target.value)} value={sort}><option value="recommended">Recommended order</option><option value="experience">Experience</option><option value="rating">Sample rating</option></select></label>
        </div>
      </Card>
      <div className="feature-results-heading"><SectionTitle eyebrow="FICTIONAL MENTORS" title="Explore sample profiles" /><span>{filtered.length} {filtered.length === 1 ? 'profile' : 'profiles'}</span></div>
      {filtered.length ? <div className="mentor-card-grid">{filtered.map((item, index) => <MentorCard index={index} key={item.id} mentor={item} />)}</div> : <EmptyResults description="Try a broader search or reset the filters to see sample mentor profiles." onReset={clearFilters} title="No sample mentors match" />}
    </FeaturePage>
  )
}
