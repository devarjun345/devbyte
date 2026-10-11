import { useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router'
import { Button, Card, EmptyState, Input } from '../components/ui'
import { EmptyResults, FeatureBackLink, FeaturePage, FeatureTag, SectionTitle, StatusNotice } from '../components/features/FeatureUI'
import { StaggerContainer, StaggerItemArticle, StaggerItem, MicroPressCard, Shake, useShakeTrigger } from '../components/ui'
import { demoAssignments, type AssignmentStatus, type DemoAssignment } from './phase5-demo-data'

const statusValues: AssignmentStatus[] = ['Not Started', 'In Progress', 'Submitted']
const dueDateValue = (value: string) => new Date(value).getTime()

function AssignmentCard({ assignment, ...staggerProps }: { assignment: DemoAssignment } & Record<string, unknown>) {
  return (
    <StaggerItemArticle {...staggerProps} className="assignment-card">
      <div className="assignment-card-top"><FeatureTag>{assignment.course}</FeatureTag><span className={`assignment-status status-${assignment.status.toLowerCase().replace(' ', '-')}`}>{assignment.status} · sample</span></div>
      <h2>{assignment.title}</h2>
      <p>{assignment.description}</p>
      <div className="assignment-card-meta"><span>Sample due date <strong>{assignment.dueDate}</strong></span><span>Priority <strong>{assignment.priority}</strong></span></div>
      <div className="assignment-progress-heading"><span>Illustrative progress</span><strong>{assignment.progress}%</strong></div>
      <div aria-label={`${assignment.title}: ${assignment.progress}% illustrative progress`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={assignment.progress} className="assignment-progress-track" role="progressbar"><span style={{ transform: `scaleX(${assignment.progress / 100})` }} /></div>
      <MicroPressCard asChild>
        <Link className="feature-card-link" to={`/practice/assignments/${assignment.id}`}>{assignment.status === 'Submitted' ? 'View assignment preview' : 'Open assignment'} <span aria-hidden="true">↗</span></Link>
      </MicroPressCard>
    </StaggerItemArticle>
  )
}

function AssignmentDetail({ assignment }: { assignment: DemoAssignment }) {
  const [response, setResponse] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState(false)
  const { trigger, shake } = useShakeTrigger()

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    const hasResponse = response.trim().length >= 30
    const hasUrl = projectUrl.trim().length > 0
    if (!hasResponse && !hasUrl) nextErrors.response = 'Add a response of at least 30 characters or provide a project URL.'
    else if (response.trim() && response.trim().length < 30) nextErrors.response = 'A written response must contain at least 30 characters.'
    if (hasUrl) {
      try {
        const parsedUrl = new URL(projectUrl)
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) nextErrors.projectUrl = 'Use a valid http or https project URL.'
      } catch {
        nextErrors.projectUrl = 'Enter a valid project URL beginning with http:// or https://.'
      }
    }
    setErrors(nextErrors)
    const isValid = Object.keys(nextErrors).length === 0
    setPreview(isValid)
    if (!isValid) shake()
  }

  return (
    <FeaturePage actions={<FeatureBackLink to="/practice/assignments">All assignments</FeatureBackLink>} description={assignment.description} eyebrow={`${assignment.course} · ASSIGNMENT PREVIEW`} title={assignment.title}>
      <StaggerContainer staggerMs={60} viewportAmount={0.15}>
        <div className="assignment-detail-grid">
          <StaggerItem staggerIndex={0} initialY={10} duration={0.32} className="assignment-detail-card">
            <div className="assignment-detail-main">
              <Card>
                <SectionTitle eyebrow="SAMPLE INSTRUCTIONS" title="Assignment overview" />
                <ul className="feature-bullet-list">{assignment.instructions.map((item) => <li key={item}>{item}</li>)}</ul>
                <SectionTitle eyebrow="CHECK BEFORE YOU FINISH" title="Requirements" />
                <ul className="feature-bullet-list">{assignment.requirements.map((item) => <li key={item}>{item}</li>)}</ul>
              </Card>
              <Card className="assignment-submit-card">
                <SectionTitle eyebrow="LOCAL FORM PREVIEW" title="Prepare a response" />
                <p className="assignment-form-note">This form only previews your draft in this browser view. It does not submit or save work to a server.</p>
                <form className="feature-form feature-form-single" noValidate onSubmit={submit}>
                  <Shake trigger={trigger}>
                    <label className="feature-select-label">Written response
                      <textarea aria-describedby={errors.response ? 'assignment-response-error' : undefined} aria-invalid={Boolean(errors.response)} maxLength={2000} onChange={(event) => { setResponse(event.target.value); setPreview(false) }} placeholder="Describe your approach, decisions, or reflection (at least 30 characters)." rows={6} value={response} />
                      <span className={errors.response ? 'feature-field-error' : 'feature-field-hint'} id={errors.response ? 'assignment-response-error' : undefined}>{errors.response ?? `${response.length}/2000`}</span>
                    </label>
                    <Input autoComplete="url" error={errors.projectUrl} helperText="Optional · use an http or https link." label="Project URL" onChange={(event) => { setProjectUrl(event.target.value); setPreview(false) }} placeholder="https://example.com/project" type="url" value={projectUrl} />
                    <Button type="submit">Preview submission</Button>
                  </Shake>
                </form>
                {preview && <div className="assignment-submission-preview"><StatusNotice title="Submission preview only">Nothing was submitted or saved. This is not a completed assignment or server confirmation.</StatusNotice>{response.trim() && <div><strong>Draft response</strong><p>{response}</p></div>}{projectUrl.trim() && <div><strong>Project URL</strong><p><a href={projectUrl} rel="noreferrer" target="_blank">{projectUrl}</a></p></div>}</div>}
              </Card>
            </div>
          </StaggerItem>
          <StaggerItem staggerIndex={1} initialY={10} duration={0.32} className="assignment-detail-card">
            <aside className="assignment-detail-side">
              <Card>
                <SectionTitle eyebrow="SAMPLE METADATA" title="At a glance" />
                <dl className="assignment-facts"><div><dt>Topic</dt><dd>{assignment.course}</dd></div><div><dt>Due date</dt><dd>{assignment.dueDate} · sample</dd></div><div><dt>Status</dt><dd>{assignment.status} · demo</dd></div><div><dt>Priority</dt><dd>{assignment.priority} · illustrative</dd></div></dl>
                <div className="assignment-progress-heading"><span>Progress preview</span><strong>{assignment.progress}%</strong></div>
                <div aria-label={`${assignment.progress}% illustrative assignment progress`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={assignment.progress} className="assignment-progress-track" role="progressbar"><span style={{ transform: `scaleX(${assignment.progress / 100})` }} /></div>
              </Card>
              <Card className="assignment-resource-note"><p className="feature-eyebrow">RESOURCES</p><p>No external resource links are attached to this sample assignment.</p></Card>
            </aside>
          </StaggerItem>
        </div>
      </StaggerContainer>
    </FeaturePage>
  )
}

export function AssignmentsPage() {
  const { assignmentId } = useParams()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('due')
  const assignment = demoAssignments.find((item) => item.id === assignmentId)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return demoAssignments
      .filter((item) => !term || [item.title, item.description, item.course].join(' ').toLowerCase().includes(term))
      .filter((item) => !status || item.status === status)
      .sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'progress' ? b.progress - a.progress : dueDateValue(a.dueDate) - dueDateValue(b.dueDate))
  }, [query, sort, status])

  if (assignmentId) {
    if (!assignment) return <FeaturePage description="That assignment does not exist in this sample set." eyebrow="NOT FOUND" title="Assignment unavailable"><EmptyState description="Return to the assignments overview and select one of the sample assignments." title="No matching assignment" action={<Link className="feature-card-link" to="/practice/assignments">Browse assignment previews</Link>} /></FeaturePage>
    return <AssignmentDetail assignment={assignment} />
  }

  function clearFilters() {
    setQuery('')
    setStatus('')
    setSort('due')
  }

  const upcomingCount = demoAssignments.filter((item) => item.status !== 'Submitted').length
  const completedCount = demoAssignments.filter((item) => item.status === 'Submitted').length

  return (
    <FeaturePage description="A small assignment overview to explore due dates, progress, and submission-preview interactions. Every course item and status here is sample content." eyebrow="PRACTICE · LEARNING TASKS" title="Assignments">
      <StaggerContainer staggerMs={60} viewportAmount={0.15}>
        <div className="assignment-summary-grid">
          <StaggerItemArticle staggerIndex={0} className="assignment-summary-card">
            <span className="assignment-summary-icon" aria-hidden="true">◷</span><p>Upcoming examples</p><strong>{upcomingCount}</strong><small>Sample tasks · not account data</small>
          </StaggerItemArticle>
          <StaggerItemArticle staggerIndex={1} className="assignment-summary-card">
            <span className="assignment-summary-icon" aria-hidden="true">✓</span><p>Completed examples</p><strong>{completedCount}</strong><small>Illustrative status only</small>
          </StaggerItemArticle>
        </div>
      </StaggerContainer>
      <Card className="feature-filter-panel">
        <div className="feature-filter-heading"><div><strong>Find an assignment</strong><span>Filter the illustrative course tasks</span></div><Button onClick={clearFilters} variant="ghost">Clear all</Button></div>
        <div className="feature-filter-grid assignment-filter-grid">
          <Input aria-label="Search assignments" label="Search" onChange={(event) => setQuery(event.target.value)} placeholder="Assignment, topic, or course" type="search" value={query} />
          <label className="feature-select-label">Status<select aria-label="Filter assignments by status" onChange={(event) => setStatus(event.target.value)} value={status}><option value="">All statuses</option>{statusValues.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="feature-select-label">Sort<select aria-label="Sort assignments" onChange={(event) => setSort(event.target.value)} value={sort}><option value="due">Due date</option><option value="title">Title A–Z</option><option value="progress">Progress</option></select></label>
        </div>
      </Card>
      <div className="feature-results-heading"><SectionTitle eyebrow="SAMPLE COURSEWORK" title="Assignment previews" /><span>{filtered.length} {filtered.length === 1 ? 'assignment' : 'assignments'}</span></div>
      {filtered.length ? <StaggerContainer className="assignment-grid" staggerMs={60} viewportAmount={0.15}>{filtered.map((item) => <AssignmentCard assignment={item} key={item.id} />)}</StaggerContainer> : <EmptyResults description="Try another search or reset your status filter." onReset={clearFilters} title="No sample assignments match" />}
    </FeaturePage>
  )
}
