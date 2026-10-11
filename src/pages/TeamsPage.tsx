import { useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { Button, Card, EmptyState, Input } from '../components/ui'
import { EmptyResults, FeatureBackLink, FeaturePage, FeatureTag, SectionTitle, StatusNotice } from '../components/features/FeatureUI'
import { StaggerContainer, StaggerItemArticle, StaggerItem, MicroPress } from '../components/ui'
import { Shake, useShakeTrigger } from '../components/ui'
import { demoTeams, type DemoTeam } from './phase4-demo-data'

const interests = [...new Set(demoTeams.flatMap((team) => team.interests))]
const teamSkills = [...new Set(demoTeams.flatMap((team) => team.skills))]

function TeamCard({ team, ...staggerProps }: { team: DemoTeam } & Record<string, unknown>) {
  return (
    <StaggerItemArticle {...staggerProps} className="feature-listing-card team-card">
      <div className="feature-card-meta">
        <FeatureTag>{team.status} · sample</FeatureTag>
        <span className="feature-status-pill status-upcoming">{team.collaboration}</span>
      </div>
      <h2>{team.name}</h2>
      <p className="feature-team-project">{team.project}</p>
      <p className="feature-card-description">{team.description}</p>
      <div className="feature-member-stack" aria-label={`${team.members.length} fictional sample members`}>
        {team.members.map((member) => <span aria-label={member.name} className="feature-avatar" key={member.initials}>{member.initials}</span>)}
        <span className="feature-member-count">{team.members.length} demo {team.members.length === 1 ? 'member' : 'members'}</span>
      </div>
      <div className="feature-tag-row">{team.skills.slice(0, 4).map((skill) => <FeatureTag key={skill}>{skill}</FeatureTag>)}</div>
      <div className="feature-team-card-actions">
        <MicroPress asChild>
          <Link className="feature-card-link" to={`/build/teams/${team.id}`}>View team <span aria-hidden="true">↗</span></Link>
        </MicroPress>
        {team.status === 'Forming' && <MicroPress asChild><Link className="feature-text-link" to={`/build/teams/${team.id}/join`}>Explore joining</Link></MicroPress>}
      </div>
    </StaggerItemArticle>
  )
}

function TeamDetails({ team }: { team: DemoTeam }) {
  return (
    <FeaturePage
      actions={<><FeatureBackLink to="/build/teams">All teams</FeatureBackLink><Link className="feature-button-link" to={`/build/teams/${team.id}/join`}>Preview join request</Link></>}
      description={team.description}
      eyebrow={`TEAM PREVIEW · ${team.status.toUpperCase()}`}
      title={team.name}
    >
      <Card className="feature-detail-hero">
        <p className="feature-eyebrow">PROJECT OVERVIEW · SAMPLE</p>
        <h2 className="feature-project-title">{team.project}</h2>
        <p className="feature-body-copy">{team.description}</p>
        <div className="feature-detail-facts">
          <div><span>Collaboration</span><strong>{team.collaboration}</strong></div>
          <div><span>Team status</span><strong>{team.status} · illustrative</strong></div>
        </div>
        <p className="feature-caution">The members and project shown are fictional demo content. No team space or membership is connected.</p>
        <h3 className="feature-subheading">Skills & technologies</h3>
        <div className="feature-tag-row">{team.skills.map((skill) => <FeatureTag key={skill}>{skill}</FeatureTag>)}</div>
        <h3 className="feature-subheading">Interests</h3>
        <div className="feature-tag-row">{team.interests.map((interest) => <FeatureTag key={interest}>{interest}</FeatureTag>)}</div>
      </Card>
      <StaggerContainer staggerMs={60} viewportAmount={0.15}>
        <div className="feature-detail-grid">
          <StaggerItem staggerIndex={0} initialY={10} duration={0.32} className="feature-detail-card">
            <Card>
              <SectionTitle eyebrow="FICTIONAL SAMPLE MEMBERS" title="People & roles" />
              <ul className="feature-member-list">
                {team.members.map((member) => <li key={member.initials}><span className="feature-avatar">{member.initials}</span><span><strong>{member.name}</strong><small>{member.role}</small></span></li>)}
              </ul>
            </Card>
          </StaggerItem>
          <StaggerItem staggerIndex={1} initialY={10} duration={0.32} className="feature-detail-card">
            <Card>
              <SectionTitle eyebrow="COLLABORATION NEEDS" title="Open roles" />
              <ul className="feature-bullet-list">{team.openRoles.map((role) => <li key={role}>{role}</li>)}</ul>
              {team.status === 'Forming' && <Link className="feature-button-link feature-inline-button" to={`/build/teams/${team.id}/join`}>Preview an introduction</Link>}
            </Card>
          </StaggerItem>
        </div>
      </StaggerContainer>
    </FeaturePage>
  )
}

function CreateTeam() {
  const [values, setValues] = useState({ name: '', project: '', description: '', skills: '', roles: '', collaboration: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState(false)
  const { trigger, shake } = useShakeTrigger()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (values.name.trim().length < 3) nextErrors.name = 'Enter a team name with at least 3 characters.'
    if (values.project.trim().length < 3) nextErrors.project = 'Enter a project title with at least 3 characters.'
    if (values.description.trim().length < 30) nextErrors.description = 'Add at least 30 characters describing the project.'
    if (!values.skills.split(',').some((item) => item.trim())) nextErrors.skills = 'Add at least one skill or technology.'
    if (!values.roles.split(',').some((item) => item.trim())) nextErrors.roles = 'Add at least one role or skill you are looking for.'
    if (!values.collaboration) nextErrors.collaboration = 'Choose a collaboration preference.'
    setErrors(nextErrors)
    const isValid = Object.keys(nextErrors).length === 0
    setPreview(isValid)
    if (!isValid) shake()
  }

  return (
    <FeaturePage
      actions={<FeatureBackLink to="/build/teams">Back to teams</FeatureBackLink>}
      description="Shape a clear project brief and collaboration plan. Submitting creates only a temporary preview in this page."
      eyebrow="BUILD · LOCAL FORM"
      title="Create a team preview"
    >
      <Card className="feature-form-card">
        <p className="feature-form-disclaimer">No team is saved or published. Your entries stay in this temporary page state.</p>
        <Shake trigger={trigger}>
          <form className="feature-form" noValidate onSubmit={submit}>
          <Input autoComplete="off" error={errors.name} label="Team name" maxLength={60} onChange={(e) => setValues({ ...values, name: e.target.value })} placeholder="e.g. Prototype Club" value={values.name} />
          <Input autoComplete="off" error={errors.project} label="Project title" maxLength={80} onChange={(e) => setValues({ ...values, project: e.target.value })} placeholder="What are you building?" value={values.project} />
          <label className="feature-select-label feature-form-wide">Project description
            <textarea aria-describedby={errors.description ? 'team-description-error' : undefined} aria-invalid={Boolean(errors.description)} maxLength={700} onChange={(e) => setValues({ ...values, description: e.target.value })} placeholder="Explain the problem, who it helps, and what you'd like to build." rows={5} value={values.description} />
            <span className={errors.description ? 'feature-field-error' : 'feature-field-hint'} id={errors.description ? 'team-description-error' : undefined}>{errors.description ?? `${values.description.length}/700 · at least 30 characters`}</span>
          </label>
          <Input error={errors.skills} helperText="Separate skills with commas." label="Skills and technologies" onChange={(e) => setValues({ ...values, skills: e.target.value })} placeholder="React, Figma, Python" value={values.skills} />
          <Input error={errors.roles} helperText="Separate desired roles with commas." label="Desired roles or skills" onChange={(e) => setValues({ ...values, roles: e.target.value })} placeholder="Frontend developer, UX research" value={values.roles} />
          <label className="feature-select-label">Collaboration preference
            <select aria-invalid={Boolean(errors.collaboration)} onChange={(e) => setValues({ ...values, collaboration: e.target.value })} value={values.collaboration}><option value="">Choose a preference</option><option>Remote · async-friendly</option><option>Remote · weekly pairing</option><option>Hybrid</option><option>In person</option></select>
            {errors.collaboration && <span className="feature-field-error">{errors.collaboration}</span>}
          </label>
          <div className="feature-form-wide feature-form-submit"><Button type="submit">Create local preview <span aria-hidden="true">↗</span></Button></div>
</form>
        </Shake>
        {preview && <div className="feature-created-preview">
          <StatusNotice title="Temporary local team preview">Nothing was saved or sent. This preview exists only until you leave or reload this page.</StatusNotice>
          <h2>{values.name}</h2><p className="feature-team-project">{values.project}</p><p>{values.description}</p>
          <div className="feature-tag-row">{values.skills.split(',').map((skill) => skill.trim()).filter(Boolean).map((skill) => <FeatureTag key={skill}>{skill}</FeatureTag>)}</div>
          <p className="feature-small-note">Looking for: {values.roles} · {values.collaboration}</p>
        </div>}
      </Card>
    </FeaturePage>
  )
}

function JoinTeam({ team }: { team: DemoTeam }) {
  const [intro, setIntro] = useState('')
  const [skills, setSkills] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState(false)
  const { trigger, shake } = useShakeTrigger()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (intro.trim().length < 30) nextErrors.intro = 'Please write at least 30 characters so the introduction has useful context.'
    if (skills.trim().length < 2) nextErrors.skills = 'Add at least one relevant skill.'
    setErrors(nextErrors)
    const isValid = Object.keys(nextErrors).length === 0
    setPreview(isValid)
    if (!isValid) shake()
  }

  return (
    <FeaturePage actions={<FeatureBackLink to={`/build/teams/${team.id}`}>Team details</FeatureBackLink>} description="Draft an introduction for this fictional team. Nothing will be sent or saved." eyebrow="TEAM COLLABORATION · PREVIEW" title={`Explore joining ${team.name}`}>
      <Card className="feature-form-card feature-join-card">
        <div className="feature-join-summary"><span className="feature-avatar">{team.members[0]?.initials}</span><div><strong>{team.project}</strong><p>{team.status} · {team.collaboration}</p></div></div>
        <div className="feature-tag-row">{team.openRoles.map((role) => <FeatureTag key={role}>{role}</FeatureTag>)}</div>
        <p className="feature-form-disclaimer">This is a local request draft for a sample team; it does not contact members or change team membership.</p>
        <form className="feature-form feature-form-single" noValidate onSubmit={submit}>
          <Shake trigger={trigger}>
            <label className="feature-select-label">Short introduction
              <textarea aria-describedby={errors.intro ? 'join-intro-error' : undefined} aria-invalid={Boolean(errors.intro)} maxLength={500} onChange={(e) => setIntro(e.target.value)} placeholder="Share what interests you about the project and how you might contribute." rows={5} value={intro} />
              <span className={errors.intro ? 'feature-field-error' : 'feature-field-hint'} id={errors.intro ? 'join-intro-error' : undefined}>{errors.intro ?? `${intro.length}/500 · at least 30 characters`}</span>
            </label>
            <Input error={errors.skills} label="Relevant skills" onChange={(e) => setSkills(e.target.value)} placeholder="React, CSS, user research" value={skills} />
            <Button type="submit">Preview introduction</Button>
          </Shake>
        </form>
        {preview && <div className="feature-created-preview"><StatusNotice title="Introduction preview only">No join request was sent. You are not a member of this team.</StatusNotice><p>{intro}</p><div className="feature-tag-row">{skills.split(',').map((item) => item.trim()).filter(Boolean).map((item) => <FeatureTag key={item}>{item}</FeatureTag>)}</div></div>}
      </Card>
    </FeaturePage>
  )
}

export function TeamsPage() {
  const { teamId } = useParams()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [interest, setInterest] = useState('')
  const [skill, setSkill] = useState('')
  const [status, setStatus] = useState('')
  const [collaboration, setCollaboration] = useState('')
  const isCreate = location.pathname.endsWith('/new')
  const isJoin = location.pathname.endsWith('/join')
  const team = teamId && teamId !== 'new' ? demoTeams.find((item) => item.id === teamId) : undefined

  const filteredTeams = useMemo(() => {
    const term = query.trim().toLowerCase()
    return demoTeams
      .filter((item) => !term || [item.name, item.project, item.description, ...item.skills].join(' ').toLowerCase().includes(term))
      .filter((item) => !interest || item.interests.includes(interest))
      .filter((item) => !skill || item.skills.includes(skill))
      .filter((item) => !status || item.status === status)
      .filter((item) => !collaboration || item.collaboration.toLowerCase().includes(collaboration.toLowerCase()))
  }, [collaboration, interest, query, skill, status])

  if (isCreate) return <CreateTeam />
  if (teamId) {
    if (!team) return <FeaturePage description="That team is not included in this local preview." eyebrow="NOT FOUND" title="Team unavailable"><EmptyState description="Choose a sample team from the discovery listing." title="No matching team" action={<Link className="feature-card-link" to="/build/teams">Browse team previews</Link>} /></FeaturePage>
    return isJoin ? <JoinTeam team={team} /> : <TeamDetails team={team} />
  }

  function clearFilters() {
    setQuery('')
    setInterest('')
    setSkill('')
    setStatus('')
    setCollaboration('')
  }

  return (
    <FeaturePage actions={<Link className="feature-button-link" to="/build/teams/new">Create a team <span aria-hidden="true">+</span></Link>} description="Find sample project groups by topic, skills, and collaboration style. All teams and members shown here are fictional previews." eyebrow="BUILD · TEAM DISCOVERY" title="Find your people">
      <Card className="feature-filter-panel">
        <div className="feature-filter-heading"><div><strong>Explore teams</strong><span>Search the sample project briefs</span></div><Button onClick={clearFilters} variant="ghost">Clear all</Button></div>
        <div className="feature-filter-grid">
          <Input aria-label="Search teams" label="Search" onChange={(e) => setQuery(e.target.value)} placeholder="Team, project, or skill" type="search" value={query} />
          <label className="feature-select-label">Interest<select aria-label="Filter by interest" onChange={(e) => setInterest(e.target.value)} value={interest}><option value="">All interests</option>{interests.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="feature-select-label">Skill<select aria-label="Filter by skill" onChange={(e) => setSkill(e.target.value)} value={skill}><option value="">All skills</option>{teamSkills.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="feature-select-label">Team status<select aria-label="Filter by team status" onChange={(e) => setStatus(e.target.value)} value={status}><option value="">All statuses</option><option>Forming</option><option>Active</option></select></label>
          <label className="feature-select-label">Collaboration<select aria-label="Filter by collaboration preference" onChange={(e) => setCollaboration(e.target.value)} value={collaboration}><option value="">All preferences</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="in person">In person</option></select></label>
        </div>
      </Card>
      <div className="feature-results-heading"><SectionTitle eyebrow="FICTIONAL PROJECT GROUPS" title="Team previews" /><span>{filteredTeams.length} {filteredTeams.length === 1 ? 'team' : 'teams'}</span></div>
      {filteredTeams.length ? <StaggerContainer className="feature-card-grid">{filteredTeams.map((item) => <TeamCard key={item.id} team={item} />)}</StaggerContainer> : <EmptyResults description="Try a different keyword or remove some filters." onReset={clearFilters} title="No demo teams match" />}
    </FeaturePage>
  )
}
