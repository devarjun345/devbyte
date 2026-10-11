import { useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { Button, Card, EmptyState, Input } from '../components/ui'
import { EmptyResults, FeatureBackLink, FeaturePage, FeatureTag, SectionTitle, StatusNotice } from '../components/features/FeatureUI'
import { StaggerContainer, StaggerItemArticle, StaggerItem, MicroPress, Shake, useShakeTrigger } from '../components/ui'
import { demoSkillSwaps, type DemoSkillSwap } from './phase4-demo-data'

const skillCategories = [...new Set(demoSkillSwaps.map((swap) => swap.category))]
const skillLevels = ['Beginner', 'Intermediate', 'Advanced'] as const
type Direction = 'all' | 'teach' | 'learn'

function SkillSwapCard({ swap, ...staggerProps }: { swap: DemoSkillSwap } & Record<string, unknown>) {
  return (
    <StaggerItemArticle {...staggerProps} className="feature-listing-card skill-swap-card">
      <div className="feature-card-meta"><FeatureTag>{swap.category}</FeatureTag><span className="feature-status-pill status-upcoming">{swap.level} · sample</span></div>
      <div className="feature-swap-profile"><span className="feature-avatar">{swap.partnerInitials}</span><div><strong>{swap.partnerName}</strong><small>Fictional peer-learning preview</small></div></div>
      <h2 className="feature-swap-title">Share {swap.offering}<span aria-hidden="true">↔</span> learn {swap.seeking}</h2>
      <p className="feature-card-description">{swap.summary}</p>
      <div className="feature-tag-row"><FeatureTag>Can teach: {swap.offering}</FeatureTag><FeatureTag>Wants to learn: {swap.seeking}</FeatureTag></div>
      <MicroPress asChild>
      <Link className="feature-card-link" to={`/discover/skill-swap/${swap.id}`}>View exchange details <span aria-hidden="true">↗</span></Link>
    </MicroPress>
    </StaggerItemArticle>
  )
}

function SkillSwapDetails({ swap }: { swap: DemoSkillSwap }) {
  return (
    <FeaturePage actions={<FeatureBackLink to="/discover/skill-swap">All skill swaps</FeatureBackLink>} description={swap.summary} eyebrow="SKILL EXCHANGE · SAMPLE PROFILE" title={`${swap.offering} for ${swap.seeking}`}>
      <Card className="feature-detail-hero skill-detail-hero">
        <div className="feature-swap-profile"><span className="feature-avatar">{swap.partnerInitials}</span><div><strong>{swap.partnerName}</strong><small>Fictional sample identity · not a registered account</small></div></div>
        <div className="feature-swap-exchange">
          <div><span>Can teach</span><strong>{swap.offering}</strong><small>{swap.level} · illustrative proficiency</small></div>
          <span aria-hidden="true">↔</span>
          <div><span>Would like to learn</span><strong>{swap.seeking}</strong><small>Level not verified</small></div>
        </div>
        <p className="feature-body-copy">{swap.summary}</p>
        <p className="feature-caution">This profile and exchange listing are demo content. A request preview will not message this person or confirm an exchange.</p>
        <Link className="feature-button-link" to={`/discover/skill-swap/${swap.id}/request`}>Draft an exchange request <span aria-hidden="true">↗</span></Link>
      </Card>
      <StaggerContainer staggerMs={60} viewportAmount={0.15}>
        <div className="feature-detail-grid">
          <StaggerItem staggerIndex={0} initialY={10} duration={0.32} className="feature-detail-card">
            <Card className="feature-swap-detail-note">
              <SectionTitle eyebrow="A PEER-LEARNING IDEA" title="Possible session outline" />
              <ol className="feature-outline-list">
                <li>Agree on one small learning goal for each person.</li>
                <li>Take turns teaching through a short example or exercise.</li>
                <li>Close by sharing notes and a next practice step.</li>
              </ol>
              <p className="feature-small-note">This outline is informational sample content, not a scheduled session.</p>
            </Card>
          </StaggerItem>
        </div>
      </StaggerContainer>
    </FeaturePage>
  )
}

function ExchangeRequest({ swap }: { swap: DemoSkillSwap }) {
  const [message, setMessage] = useState('')
  const [goal, setGoal] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState(false)
  const { trigger, shake } = useShakeTrigger()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (message.trim().length < 25) nextErrors.message = 'Write at least 25 characters to explain what you hope to exchange.'
    if (!goal.trim()) nextErrors.goal = 'Add one learning goal for the exchange.'
    setErrors(nextErrors)
    const isValid = Object.keys(nextErrors).length === 0
    setPreview(isValid)
    if (!isValid) shake()
  }

  return (
    <FeaturePage actions={<FeatureBackLink to={`/discover/skill-swap/${swap.id}`}>Exchange details</FeatureBackLink>} description="Draft a clear learning proposal. This form stays local and does not send a message." eyebrow="SKILL SWAP · REQUEST PREVIEW" title="Draft an exchange">
      <Card className="feature-form-card feature-exchange-form-card">
        <div className="feature-swap-profile"><span className="feature-avatar">{swap.partnerInitials}</span><div><strong>{swap.partnerName}</strong><small>Sample exchange: {swap.offering} ↔ {swap.seeking}</small></div></div>
        <p className="feature-form-disclaimer">No message will be delivered and no exchange will be created or confirmed.</p>
        <form className="feature-form feature-form-single" noValidate onSubmit={submit}>
          <Shake trigger={trigger}>
            <label className="feature-select-label">What would you like to learn?
              <textarea aria-describedby={errors.goal ? 'swap-goal-error' : undefined} aria-invalid={Boolean(errors.goal)} maxLength={240} onChange={(e) => setGoal(e.target.value)} placeholder={`e.g. Build confidence with ${swap.offering}.`} rows={3} value={goal} />
              {errors.goal && <span className="feature-field-error" id="swap-goal-error">{errors.goal}</span>}
            </label>
            <label className="feature-select-label">Your introduction
              <textarea aria-describedby={errors.message ? 'swap-message-error' : undefined} aria-invalid={Boolean(errors.message)} maxLength={500} onChange={(e) => setMessage(e.target.value)} placeholder="Share what you can offer in return and how you like to learn." rows={5} value={message} />
              <span className={errors.message ? 'feature-field-error' : 'feature-field-hint'} id={errors.message ? 'swap-message-error' : undefined}>{errors.message ?? `${message.length}/500 · at least 25 characters`}</span>
            </label>
            <Button type="submit">Preview exchange request</Button>
          </Shake>
        </form>
        {preview && <div className="feature-created-preview"><StatusNotice title="Request preview only">Your text was not sent. This sample profile cannot receive messages.</StatusNotice><h2>Learning goal</h2><p>{goal}</p><h2>Your introduction</h2><p>{message}</p></div>}
      </Card>
    </FeaturePage>
  )
}

export function SkillSwapPage() {
  const { exchangeId } = useParams()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [level, setLevel] = useState('')
  const [direction, setDirection] = useState<Direction>('all')
  const swap = demoSkillSwaps.find((item) => item.id === exchangeId)
  const isRequest = location.pathname.endsWith('/request')

  const filteredSwaps = useMemo(() => {
    const term = query.trim().toLowerCase()
    return demoSkillSwaps
      .filter((item) => !term || [item.partnerName, item.offering, item.seeking, item.summary, item.category].join(' ').toLowerCase().includes(term))
      .filter((item) => !category || item.category === category)
      .filter((item) => !level || item.level === level)
      .filter((item) => direction === 'all' || !term || (direction === 'teach' ? item.seeking.toLowerCase().includes(term) : item.offering.toLowerCase().includes(term)))
  }, [category, direction, level, query])

  if (exchangeId) {
    if (!swap) return <FeaturePage description="This exchange is not included in the local sample set." eyebrow="NOT FOUND" title="Exchange unavailable"><EmptyState description="Return to the listing and choose a sample exchange." title="No matching exchange" action={<Link className="feature-card-link" to="/discover/skill-swap">Browse skill-swap previews</Link>} /></FeaturePage>
    return isRequest ? <ExchangeRequest swap={swap} /> : <SkillSwapDetails swap={swap} />
  }

  function clearFilters() {
    setQuery('')
    setCategory('')
    setLevel('')
    setDirection('all')
  }

  return (
    <FeaturePage description="Explore peer-learning exchange ideas, from React for Python to interface design for Git guidance. Profiles and listings are fictional demo content." eyebrow="DISCOVER · PEER LEARNING" title="Skill Swap">
      <Card className="feature-filter-panel">
        <div className="feature-filter-heading"><div><strong>Find an exchange</strong><span>Browse sample learning pairs</span></div><Button onClick={clearFilters} variant="ghost">Clear all</Button></div>
        <div className="feature-filter-grid feature-swap-filters">
          <Input aria-label="Search skills" label="Search skill" onChange={(e) => setQuery(e.target.value)} placeholder="React, Python, design…" type="search" value={query} />
          <label className="feature-select-label">Category<select aria-label="Filter skill swap by category" onChange={(e) => setCategory(e.target.value)} value={category}><option value="">All categories</option>{skillCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="feature-select-label">Proficiency<select aria-label="Filter by proficiency" onChange={(e) => setLevel(e.target.value)} value={level}><option value="">Any proficiency</option>{skillLevels.map((item) => <option key={item}>{item}</option>)}</select></label>
          <fieldset className="feature-direction-filter"><legend>Exchange direction</legend><div role="group" aria-label="Filter by exchange direction">{([['all', 'All'], ['teach', 'I can teach'], ['learn', 'I want to learn']] as [Direction, string][]).map(([value, label]) => <button aria-pressed={direction === value} className={direction === value ? 'is-active' : ''} key={value} onClick={() => setDirection(value)} type="button">{label}</button>)}</div></fieldset>
        </div>
      </Card>
      <div className="feature-results-heading"><SectionTitle eyebrow="FICTIONAL PEER EXCHANGES" title="Learning opportunities" /><span>{filteredSwaps.length} {filteredSwaps.length === 1 ? 'exchange' : 'exchanges'}</span></div>
      {filteredSwaps.length ? <StaggerContainer className="feature-card-grid">{filteredSwaps.map((item) => <SkillSwapCard key={item.id} swap={item} />)}</StaggerContainer> : <EmptyResults description="Try a broader skill search or reset the filters." onReset={clearFilters} title="No sample exchanges match" />}
    </FeaturePage>
  )
}
