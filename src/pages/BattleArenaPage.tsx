import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button, Card, EmptyState, Input } from '../components/ui'
import { EmptyResults, FeatureBackLink, FeaturePage, FeatureTag, SectionTitle, StatusNotice } from '../components/features/FeatureUI'
import { demoChallenges, type ChallengeDifficulty, type DemoChallenge } from './phase5-demo-data'

const difficultyOrder: Record<ChallengeDifficulty, number> = { Easy: 1, Medium: 2, Hard: 3 }
const allTopics = [...new Set(demoChallenges.flatMap((challenge) => challenge.topics))]
type WorkspaceTab = 'Description' | 'Examples' | 'Submissions'

function ChallengeCard({ challenge, index }: { challenge: DemoChallenge; index: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.article
      className="arena-challenge-card"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, delay: reduceMotion ? 0 : index * 0.055 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="arena-card-meta">
        <span className={`arena-difficulty difficulty-${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
        <span className="arena-demo-mark">SAMPLE</span>
      </div>
      <h2>{challenge.title}</h2>
      <p>{challenge.description}</p>
      <div className="arena-card-topics">{challenge.topics.map((topic) => <FeatureTag key={topic}>{topic}</FeatureTag>)}</div>
      <div className="arena-card-footer"><span>{challenge.duration} min · illustrative estimate</span><Link to={`/practice/battle-arena/${challenge.id}`}>Open workspace <span aria-hidden="true">↗</span></Link></div>
    </motion.article>
  )
}

function CodeWorkspace({ challenge }: { challenge: DemoChallenge }) {
  const [language, setLanguage] = useState('TypeScript')
  const [code, setCode] = useState(challenge.starterCode.TypeScript)
  const [tab, setTab] = useState<WorkspaceTab>('Description')
  const [runPreview, setRunPreview] = useState(false)
  const [submissionPreview, setSubmissionPreview] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')
  const reduceMotion = useReducedMotion()

  function changeLanguage(value: string) {
    setLanguage(value)
    setCode(challenge.starterCode[value] ?? '')
    setRunPreview(false)
    setSubmissionPreview(false)
  }

  async function copySampleCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopyMessage('Starter sample copied to the clipboard.')
    } catch {
      setCopyMessage('Clipboard access is unavailable. Select the editor text and copy it manually.')
    }
  }

  return (
    <div className="arena-workspace">
      <section aria-label="Challenge information" className="arena-problem-panel">
        <div className="arena-panel-heading">
          <div><p className="feature-eyebrow">CHALLENGE BRIEF · SAMPLE</p><h2>{challenge.title}</h2></div>
          <span className={`arena-difficulty difficulty-${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
        </div>
        <div aria-label="Challenge sections" className="arena-tabs" onKeyDown={(event) => {
          const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
          const current = tabs.indexOf(document.activeElement as HTMLButtonElement)
          let next = current
          if (event.key === 'ArrowRight') next = (current + 1) % tabs.length
          else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length
          else if (event.key === 'Home') next = 0
          else if (event.key === 'End') next = tabs.length - 1
          else return
          event.preventDefault()
          tabs[next]?.focus()
          const nextTab = tabs[next]?.textContent as WorkspaceTab | undefined
          if (nextTab) setTab(nextTab)
        }} role="tablist">
          {(['Description', 'Examples', 'Submissions'] as WorkspaceTab[]).map((item) => (
            <button aria-controls={`arena-panel-${item.toLowerCase()}`} aria-selected={tab === item} className={tab === item ? 'is-active' : ''} id={`arena-tab-${item.toLowerCase()}`} key={item} onClick={() => setTab(item)} role="tab" type="button">
              {item}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            aria-labelledby={`arena-tab-${tab.toLowerCase()}`}
            className="arena-tab-panel"
            id={`arena-panel-${tab.toLowerCase()}`}
            key={tab}
            role="tabpanel"
            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: reduceMotion ? 0 : 0.16 }}
          >
            {tab === 'Description' && <>
              <p className="arena-problem-description">{challenge.description}</p>
              <SectionTitle eyebrow="INPUT & OUTPUT" title="Examples" />
              <div className="arena-example-list">
                {challenge.examples.slice(0, 1).map((example) => <div className="arena-example" key={example.input}><p><strong>Input</strong><code>{example.input}</code></p><p><strong>Output</strong><code>{example.output}</code></p><small>{example.explanation}</small></div>)}
              </div>
              <SectionTitle eyebrow="LIMITS TO CONSIDER" title="Constraints" />
              <ul className="feature-bullet-list">{challenge.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul>
            </>}
            {tab === 'Examples' && <div className="arena-example-list">{challenge.examples.map((example, index) => <div className="arena-example" key={example.input}><strong>Sample case {index + 1} · illustrative</strong><p><span>Input</span><code>{example.input}</code></p><p><span>Output</span><code>{example.output}</code></p><small>{example.explanation}</small></div>)}</div>}
            {tab === 'Submissions' && <EmptyState description="This demo workspace has no saved submissions or connected account. Preview actions are not recorded." title="No saved submissions" />}
          </motion.div>
        </AnimatePresence>
      </section>
      <section aria-label="Code editor preview" className="arena-editor-panel">
        <div className="arena-editor-toolbar">
          <label>Language<select aria-label="Programming language" onChange={(event) => changeLanguage(event.target.value)} value={language}><option>TypeScript</option><option>JavaScript</option><option>Python</option></select></label>
          <Button onClick={() => void copySampleCode()} variant="ghost">Copy starter</Button>
        </div>
        {copyMessage && <p className="arena-copy-message" role="status">{copyMessage}</p>}
        <label className="arena-editor-label" htmlFor="arena-code-editor">Code editor-style starter · {language}</label>
        <div className="arena-code-frame">
          <span aria-hidden="true" className="arena-line-numbers">{code.split('\n').map((_, index) => index + 1).join('\n')}</span>
          <textarea autoCapitalize="off" autoComplete="off" autoCorrect="off" className="arena-code-editor" id="arena-code-editor" onChange={(event) => { setCode(event.target.value); setRunPreview(false); setSubmissionPreview(false) }} spellCheck={false} value={code} />
        </div>
        <p className="arena-editor-note">This lightweight editor is for drafting only; syntax highlighting and code execution are not connected.</p>
        <div className="arena-run-actions"><Button onClick={() => { setRunPreview(true); setSubmissionPreview(false) }} variant="outline">Run sample preview</Button><Button onClick={() => { setSubmissionPreview(true); setRunPreview(false) }}>Submit preview</Button></div>
        {runPreview && <div className="arena-result-notice"><StatusNotice title="Illustrative test preview">No code was executed. Sample result: 2 example cases listed; output was not evaluated.</StatusNotice></div>}
        {submissionPreview && <div className="arena-result-notice"><StatusNotice title="Submission preview only">No code was submitted or saved. There is no execution service or connected account.</StatusNotice></div>}
      </section>
    </div>
  )
}

export function BattleArenaPage() {
  const { challengeId } = useParams()
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [topic, setTopic] = useState('')
  const [sort, setSort] = useState('recommended')
  const challenge = demoChallenges.find((item) => item.id === challengeId)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return demoChallenges
      .filter((item) => !term || [item.title, item.description, ...item.topics].join(' ').toLowerCase().includes(term))
      .filter((item) => !difficulty || item.difficulty === difficulty)
      .filter((item) => !topic || item.topics.includes(topic))
      .sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : sort === 'difficulty' ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] : a.duration - b.duration)
  }, [difficulty, query, sort, topic])

  function clearFilters() {
    setQuery('')
    setDifficulty('')
    setTopic('')
    setSort('recommended')
  }

  if (challengeId) {
    if (!challenge) {
      return <FeaturePage description="That challenge is not included in this sample catalogue." eyebrow="NOT FOUND" title="Challenge unavailable"><EmptyState description="Return to the challenge catalogue and choose a sample challenge." title="No matching challenge" action={<Link className="feature-card-link" to="/practice/battle-arena">Browse challenge samples</Link>} /></FeaturePage>
    }
    return <FeaturePage actions={<FeatureBackLink to="/practice/battle-arena">All challenges</FeatureBackLink>} description="Explore the sample prompt, edit a starter snippet, or inspect the illustrative test preview." eyebrow="PRACTICE · CODING WORKSPACE" title={challenge.title}><CodeWorkspace challenge={challenge} /></FeaturePage>
  }

  return (
    <FeaturePage description="Browse small coding prompts by topic and difficulty. Every challenge and estimate is sample content for interface preview." eyebrow="PRACTICE · CHALLENGE CATALOGUE" title="Battle Arena">
      <Card className="feature-filter-panel">
        <div className="feature-filter-heading"><div><strong>Choose a challenge</strong><span>Search by title or topic</span></div><Button onClick={clearFilters} variant="ghost">Clear all</Button></div>
        <div className="feature-filter-grid arena-filter-grid">
          <Input aria-label="Search challenges" label="Search" onChange={(event) => setQuery(event.target.value)} placeholder="Challenge title or topic" type="search" value={query} />
          <label className="feature-select-label">Difficulty<select aria-label="Filter by difficulty" onChange={(event) => setDifficulty(event.target.value)} value={difficulty}><option value="">All difficulties</option>{(['Easy', 'Medium', 'Hard'] as ChallengeDifficulty[]).map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="feature-select-label">Topic<select aria-label="Filter by topic" onChange={(event) => setTopic(event.target.value)} value={topic}><option value="">All topics</option>{allTopics.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="feature-select-label">Sort<select aria-label="Sort challenges" onChange={(event) => setSort(event.target.value)} value={sort}><option value="recommended">Estimated time</option><option value="title">Title A–Z</option><option value="difficulty">Difficulty</option></select></label>
        </div>
      </Card>
      <div className="feature-results-heading"><SectionTitle eyebrow="DEMO CHALLENGES" title="Pick a prompt" /><span>{filtered.length} {filtered.length === 1 ? 'challenge' : 'challenges'}</span></div>
      {filtered.length ? <div className="arena-challenge-grid">{filtered.map((item, index) => <ChallengeCard challenge={item} index={index} key={item.id} />)}</div> : <EmptyResults description="Try another phrase or clear a filter to see the sample challenge set." onReset={clearFilters} title="No sample challenges match" />}
    </FeaturePage>
  )
}
