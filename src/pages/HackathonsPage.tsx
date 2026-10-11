import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button, Card, EmptyState, Input } from '../components/ui'
import { EmptyResults, FeatureBackLink, FeaturePage, FeatureTag, SectionTitle, StatusNotice } from '../components/features/FeatureUI'
import { StaggerContainer, StaggerItemArticle, StaggerItem, MicroPress } from '../components/ui'
import { demoHackathons, type DemoHackathon, type EventMode, type HackathonStatus } from './phase4-demo-data'

const categories = [...new Set(demoHackathons.map((event) => event.category))]

function HackathonCard({ event, ...staggerProps }: { event: DemoHackathon } & Record<string, unknown>) {
  return (
    <StaggerItemArticle {...staggerProps} className="feature-listing-card hackathon-card">
      <div className="feature-card-meta">
        <FeatureTag>{event.category}</FeatureTag>
        <span className={`feature-status-pill status-${event.status.toLowerCase()}`}>{event.status} · sample</span>
      </div>
      <h2>{event.title}</h2>
      <p className="feature-card-description">{event.description}</p>
      <div className="feature-facts">
        <span><b aria-hidden="true">◷</b> {event.startDate} – {event.endDate}</span>
        <span><b aria-hidden="true">⌖</b> {event.mode} · {event.location}</span>
        <span><b aria-hidden="true">◇</b> {event.organizer}</span>
      </div>
      <div className="feature-tag-row">{event.tags.map((tag) => <FeatureTag key={tag}>{tag}</FeatureTag>)}</div>
      <MicroPress asChild>
        <Link className="feature-card-link" to={`/discover/hackathons/${event.id}`}>
          View event brief <span aria-hidden="true">↗</span>
        </Link>
      </MicroPress>
    </StaggerItemArticle>
  )
}

function HackathonDetails({ event }: { event: DemoHackathon }) {
  const [participationInfo, setParticipationInfo] = useState(false)

  return (
    <FeaturePage
      actions={<FeatureBackLink to="/discover/hackathons">All hackathons</FeatureBackLink>}
      description={event.description}
      eyebrow={`${event.category} · ${event.status} sample`}
      title={event.title}
    >
      <Card className="feature-detail-hero">
        <div className="feature-card-meta">
          <FeatureTag>{event.mode}</FeatureTag>
          <span className={`feature-status-pill status-${event.status.toLowerCase()}`}>{event.status} · sample</span>
        </div>
        <p className="feature-detail-organizer">{event.organizer}</p>
        <div className="feature-detail-facts">
          <div><span>Sample dates</span><strong>{event.startDate} – {event.endDate}</strong></div>
          <div><span>Format & location</span><strong>{event.mode} · {event.location}</strong></div>
        </div>
        <p className="feature-caution">This event is an illustrative listing. Dates, availability, prizes, and organizer details are not verified.</p>
        <Button onClick={() => setParticipationInfo((visible) => !visible)}>
          View participation preview
        </Button>
        {participationInfo && <div className="feature-participation-info"><StatusNotice title="Informational preview only">There is no registration process or verified event availability connected to this listing.</StatusNotice></div>}
      </Card>
      <StaggerContainer staggerMs={60} viewportAmount={0.15}>
        <div className="feature-detail-grid">
          <StaggerItem staggerIndex={0} initialY={10} duration={0.32} className="feature-detail-card">
            <Card>
              <SectionTitle eyebrow="IMPORTANT DATES · SAMPLE" title="Timeline" />
              <ol className="feature-timeline">
                {event.timeline.map((entry) => (
                  <li key={entry.label}><span aria-hidden="true" /><div><strong>{entry.label}</strong><p>{entry.date}</p></div></li>
                ))}
              </ol>
            </Card>
          </StaggerItem>
          <StaggerItem staggerIndex={1} initialY={10} duration={0.32} className="feature-detail-card">
            <Card>
              <SectionTitle eyebrow="THE BRIEF" title="Themes & tracks" />
              <div className="feature-tag-row">{event.themes.map((theme) => <FeatureTag key={theme}>{theme}</FeatureTag>)}</div>
              <h3 className="feature-subheading">Eligibility</h3>
              <ul className="feature-bullet-list">{event.eligibility.map((item) => <li key={item}>{item}</li>)}</ul>
            </Card>
          </StaggerItem>
          <StaggerItem staggerIndex={2} initialY={10} duration={0.32} className="feature-detail-card">
            <Card>
              <SectionTitle eyebrow="ILLUSTRATIVE ONLY" title="Prizes" />
              <ul className="feature-bullet-list">{event.prizes.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="feature-small-note">No real award, event, or organizer information is represented here.</p>
            </Card>
          </StaggerItem>
          <StaggerItem staggerIndex={3} initialY={10} duration={0.32} className="feature-detail-card">
            <Card>
              <SectionTitle eyebrow="SAMPLE BRIEF" title="Requirements" />
              <ul className="feature-bullet-list">{event.requirements.map((item) => <li key={item}>{item}</li>)}</ul>
            </Card>
          </StaggerItem>
        </div>
      </StaggerContainer>
      <section className="feature-related">
        <SectionTitle eyebrow="MORE PREVIEW BRIEFS" title="Related hackathons" />
        <div className="feature-mini-list">
          {demoHackathons.filter((item) => item.id !== event.id).slice(0, 2).map((related) => (
            <Link key={related.id} to={`/discover/hackathons/${related.id}`}>
              <span><strong>{related.title}</strong><small>{related.category} · {related.startDate}</small></span><span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
    </FeaturePage>
  )
}

export function HackathonsPage() {
  const { hackathonId } = useParams()
  const event = demoHackathons.find((item) => item.id === hackathonId)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [mode, setMode] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('date')

  const filteredEvents = useMemo(() => {
    const term = query.trim().toLowerCase()
    return demoHackathons
      .filter((item) => !term || [item.title, item.description, item.organizer, item.category, ...item.tags].join(' ').toLowerCase().includes(term))
      .filter((item) => !category || item.category === category)
      .filter((item) => !mode || item.mode === mode)
      .filter((item) => !status || item.status === status)
      .sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }, [category, mode, query, sort, status])

  if (hackathonId) {
    if (!event) {
      return (
        <FeaturePage description="That event brief is not included in this local preview." eyebrow="NOT FOUND" title="Hackathon unavailable">
          <EmptyState description="Choose a sample brief from the listing to continue." title="No matching event" action={<Link className="feature-card-link" to="/discover/hackathons">Browse hackathon previews</Link>} />
        </FeaturePage>
      )
    }
    return <HackathonDetails event={event} />
  }

  function clearFilters() {
    setQuery('')
    setCategory('')
    setMode('')
    setStatus('')
    setSort('date')
  }

  return (
    <FeaturePage
      actions={<Link className="feature-secondary-link" to="/build/teams">Find teammates <span aria-hidden="true">↗</span></Link>}
      description="Explore illustrative event briefs and find a prompt for your next build. Listings and dates are sample content, not verified opportunities."
      eyebrow="DISCOVER · EVENT PREVIEWS"
      title="Hackathons"
    >
      <Card className="feature-filter-panel">
        <div className="feature-filter-heading"><div><strong>Find a brief</strong><span>Filter the sample listings</span></div><Button onClick={clearFilters} variant="ghost">Clear all</Button></div>
        <div className="feature-filter-grid">
          <Input aria-label="Search hackathons" label="Search" onChange={(e) => setQuery(e.target.value)} placeholder="Name, theme, or organizer" type="search" value={query} />
          <label className="feature-select-label">Category<select aria-label="Filter by category" onChange={(e) => setCategory(e.target.value)} value={category}><option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="feature-select-label">Mode<select aria-label="Filter by mode" onChange={(e) => setMode(e.target.value)} value={mode}><option value="">All modes</option>{(['Online', 'Offline', 'Hybrid'] as EventMode[]).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="feature-select-label">Status<select aria-label="Filter by status" onChange={(e) => setStatus(e.target.value)} value={status}><option value="">All statuses</option>{(['Upcoming', 'Ongoing', 'Completed'] as HackathonStatus[]).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="feature-select-label">Sort<select aria-label="Sort hackathons" onChange={(e) => setSort(e.target.value)} value={sort}><option value="date">Date</option><option value="title">Title A–Z</option></select></label>
        </div>
      </Card>
      <div className="feature-results-heading"><SectionTitle eyebrow="SAMPLE LISTINGS" title="Explore event briefs" /><span>{filteredEvents.length} {filteredEvents.length === 1 ? 'brief' : 'briefs'}</span></div>
      {filteredEvents.length ? <StaggerContainer className="feature-card-grid">{filteredEvents.map((item) => <HackathonCard event={item} key={item.id} />)}</StaggerContainer> : <EmptyResults description="Try a different search or remove one of the filters." onReset={clearFilters} title="No sample briefs match" />}
    </FeaturePage>
  )
}
