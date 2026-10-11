import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Button, Card } from '../components/ui'
import { FeaturePage, FeatureTag, SectionTitle } from '../components/features/FeatureUI'
import { StaggerContainer, StaggerItemArticle, MicroPressCard } from '../components/ui'
import { demoMatchProfiles } from './phase4-demo-data'

const skillOptions = ['React', 'TypeScript', 'Python', 'Figma', 'UI design', 'Data visualization', 'Git & GitHub', 'Accessibility']
const domainOptions = ['Learning tools', 'Civic tech', 'Climate tech', 'Open source', 'Developer education', 'Creative coding']
const roleOptions = ['Frontend developer', 'Backend developer', 'Product designer', 'Data specialist', 'Researcher', 'Project coordinator']
const collaborationOptions = ['Remote async', 'Remote pairing', 'Hybrid', 'In person']

function ChoiceGroup({
  label,
  options,
  selected,
  onToggle,
  error,
}: {
  error?: string
  label: string
  onToggle: (value: string) => void
  options: string[]
  selected: string[]
}) {
  return (
    <fieldset className="feature-choice-group">
      <legend>{label}</legend>
      <div className="feature-choice-list">
        {options.map((option) => {
          const active = selected.includes(option)
          return (
            <button aria-pressed={active} className={`feature-choice${active ? ' is-selected' : ''}`} key={option} onClick={() => onToggle(option)} type="button">
              {active && <span aria-hidden="true">✓</span>}{option}
            </button>
          )
        })}
      </div>
      {error && <span className="feature-field-error" role="alert">{error}</span>}
    </fieldset>
  )
}

function MatchProfileCard({ profile, index }: { index: number; profile: (typeof demoMatchProfiles)[number] }) {
  return (
    <StaggerItemArticle
      staggerIndex={index}
      staggerMs={70}
      initialY={14}
      duration={0.38}
      className="feature-match-card"
    >
      <MicroPressCard>
        <div className="feature-match-top"><span className="feature-avatar">{profile.name.split(' ').slice(0, 2).map((part) => part[0]).join('')}</span><span className="feature-score">{profile.compatibility}%<small>illustrative</small></span></div>
        <h3>{profile.name}</h3>
        <p className="feature-match-role">{profile.role} · sample role</p>
        <div className="feature-match-section"><span>Can offer</span><div className="feature-tag-row">{profile.skills.map((skill) => <FeatureTag key={skill}>{skill}</FeatureTag>)}</div></div>
        <div className="feature-match-section"><span>Would like to learn</span><div className="feature-tag-row">{profile.wantsToLearn.map((skill) => <FeatureTag key={skill}>{skill}</FeatureTag>)}</div></div>
        <div className="feature-match-section"><span>Interests</span><div className="feature-tag-row">{profile.interests.map((interest) => <FeatureTag key={interest}>{interest}</FeatureTag>)}</div></div>
        <p className="feature-small-note">Static sample profile · score is an illustration, not a calculated match.</p>
      </MicroPressCard>
    </StaggerItemArticle>
  )
}

export function TeamMatcherPage() {
  const [skills, setSkills] = useState<string[]>([])
  const [learning, setLearning] = useState<string[]>([])
  const [domains, setDomains] = useState<string[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [experience, setExperience] = useState('')
  const [collaboration, setCollaboration] = useState<string[]>([])
  const [availability, setAvailability] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const reduceMotion = useReducedMotion()

  const completedSections = useMemo(() => [
    skills.length > 0 && learning.length > 0,
    domains.length > 0 && roles.length > 0 && Boolean(experience) && collaboration.length > 0,
  ].filter(Boolean).length, [collaboration.length, domains.length, experience, learning.length, roles.length, skills.length])

  function toggle(setter: (next: string[]) => void, current: string[], value: string) {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value])
    setErrors({})
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!skills.length) nextErrors.skills = 'Choose at least one skill you can contribute.'
    if (!learning.length) nextErrors.learning = 'Choose at least one skill you want to learn.'
    if (!domains.length) nextErrors.domains = 'Choose at least one project domain.'
    if (!roles.length) nextErrors.roles = 'Choose at least one team role.'
    if (!experience) nextErrors.experience = 'Select an experience level.'
    if (!collaboration.length) nextErrors.collaboration = 'Choose a collaboration preference.'
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) setShowResults(true)
  }

  const content: ReactNode = showResults ? (
    <motion.div key="results" animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} initial={reduceMotion ? false : { opacity: 0, x: 8 }} transition={{ duration: reduceMotion ? 0 : 0.22 }}>
      <Card className="feature-match-results-intro">
        <div><p className="feature-eyebrow">SAMPLE EXPLORATION</p><h2>Potential collaboration styles</h2><p>These fictional profiles are static examples. No AI model ran, and no real people were matched.</p></div>
        <Button onClick={() => setShowResults(false)} variant="outline">Edit preferences</Button>
      </Card>
      <div className="feature-preference-summary"><strong>Your selected preferences</strong><p><b>Can contribute:</b> {skills.join(', ')} · <b>Want to learn:</b> {learning.join(', ')}</p><p><b>Domains:</b> {domains.join(', ')} · <b>Roles:</b> {roles.join(', ')} · <b>Experience:</b> {experience} · <b>Collaboration:</b> {collaboration.join(', ')}{availability ? ` · Availability: ${availability}` : ''}</p></div>
      <div className="feature-match-grid">
        <StaggerContainer staggerMs={70} viewportAmount={0.15}>
          {demoMatchProfiles.map((profile, index) => <MatchProfileCard index={index} key={profile.id} profile={profile} />)}
        </StaggerContainer>
      </div>
    </motion.div>
  ) : (
    <motion.form className="feature-matcher-form" key="form" noValidate onSubmit={submit} initial={false} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: reduceMotion ? 0 : 0.22 }}>
      <Card className="feature-matcher-intro">
        <div><p className="feature-eyebrow">YOUR COLLABORATION SNAPSHOT</p><h2>Start with how you like to build</h2><p>Choose a few preferences to explore static sample profiles. You can edit everything before viewing them.</p></div>
        <div aria-label={`${completedSections} of 2 preference groups completed`} className="feature-step-indicator"><span>{completedSections}/2</span><small>groups ready</small><div aria-valuemax={2} aria-valuemin={0} aria-valuenow={completedSections} role="progressbar"><span style={{ transform: `scaleX(${completedSections / 2})` }} /></div></div>
      </Card>
      <div className="feature-matcher-grid">
        <Card><SectionTitle eyebrow="01 · OFFER & LEARN" title="Skills" /><ChoiceGroup error={errors.skills} label="Skills I can contribute" onToggle={(item) => toggle(setSkills, skills, item)} options={skillOptions} selected={skills} /><ChoiceGroup error={errors.learning} label="Skills I want to learn" onToggle={(item) => toggle(setLearning, learning, item)} options={skillOptions} selected={learning} /></Card>
        <Card><SectionTitle eyebrow="02 · PROJECT FIT" title="What you want to build" /><ChoiceGroup error={errors.domains} label="Preferred project domains" onToggle={(item) => toggle(setDomains, domains, item)} options={domainOptions} selected={domains} /><ChoiceGroup error={errors.roles} label="Preferred team roles" onToggle={(item) => toggle(setRoles, roles, item)} options={roleOptions} selected={roles} /></Card>
        <Card className="feature-matcher-preferences"><SectionTitle eyebrow="03 · WORKING STYLE" title="Your preferences" /><label className="feature-select-label">Experience level<select aria-invalid={Boolean(errors.experience)} onChange={(e) => { setExperience(e.target.value); setErrors({}) }} value={experience}><option value="">Choose a level</option><option>Exploring</option><option>Early experience</option><option>Comfortable</option><option>Experienced</option></select>{errors.experience && <span className="feature-field-error">{errors.experience}</span>}</label><ChoiceGroup error={errors.collaboration} label="Collaboration preferences" onToggle={(item) => toggle(setCollaboration, collaboration, item)} options={collaborationOptions} selected={collaboration} /><label className="feature-select-label">Availability (optional)<select onChange={(e) => setAvailability(e.target.value)} value={availability}><option value="">No preference</option><option>Weekday evenings</option><option>Weekends</option><option>Flexible / async</option></select></label><Button type="submit">Explore sample profiles <span aria-hidden="true">↗</span></Button></Card>
      </div>
    </motion.form>
  )

  return (
    <FeaturePage description="Set the skills and working style you want in a project partner. This frontend preview does not access an AI model or real profiles." eyebrow="DISCOVER · TEAM MATCHER" title="Find a build rhythm">
      <div className="feature-matcher-disclaimer"><span aria-hidden="true">i</span><p><strong>Sample-only matching preview.</strong> Results below are fictional profiles and fixed illustrative scores; there is no live matching algorithm or user directory.</p></div>
      <AnimatePresence mode="wait" initial={false}>{content}</AnimatePresence>
    </FeaturePage>
  )
}
