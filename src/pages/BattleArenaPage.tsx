import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Button, Card, EmptyState, Input } from '../components/ui'
import { EmptyResults, FeatureBackLink, FeaturePage, FeatureTag, CodeWorkspace, SectionTitle } from '../components/features/FeatureUI'
import { StaggerContainer, StaggerItemArticle, MicroPressCard } from '../components/ui'
import { demoChallenges, type ChallengeDifficulty, type DemoChallenge } from './phase5-demo-data'

const difficultyOrder: Record<ChallengeDifficulty, number> = { Easy: 1, Medium: 2, Hard: 3 }
const allTopics = [...new Set(demoChallenges.flatMap((challenge) => challenge.topics))]

function ChallengeCard({ challenge, index }: { challenge: DemoChallenge; index: number }) {
  return (
    <StaggerItemArticle
      staggerIndex={index}
      staggerMs={60}
      initialY={12}
      duration={0.28}
      className="arena-challenge-card"
    >
      <MicroPressCard>
        <div className="arena-card-meta">
          <span className={`arena-difficulty difficulty-${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
          <span className="arena-demo-mark">SAMPLE</span>
        </div>
        <h2>{challenge.title}</h2>
        <p>{challenge.description}</p>
        <div className="arena-card-topics">{challenge.topics.map((topic) => <FeatureTag key={topic}>{topic}</FeatureTag>)}</div>
        <div className="arena-card-footer"><span>{challenge.duration} min · illustrative estimate</span><Link to={`/practice/battle-arena/${challenge.id}`}>Open workspace <span aria-hidden="true">↗</span></Link></div>
      </MicroPressCard>
    </StaggerItemArticle>
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
    return <FeaturePage actions={<FeatureBackLink to="/practice/battle-arena">All challenges</FeatureBackLink>} description="Explore the sample prompt, edit a starter snippet, or inspect the illustrative test preview." eyebrow="PRACTICE · CODING WORKSPACE" title={challenge.title}><CodeWorkspace title={challenge.title} difficulty={challenge.difficulty} description={challenge.description} examples={challenge.examples} constraints={challenge.constraints} starterCode={challenge.starterCode} topics={challenge.topics} /></FeaturePage>
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
      {filtered.length ? <StaggerContainer className="arena-challenge-grid" staggerMs={60} viewportAmount={0.15}>{filtered.map((item, index) => <ChallengeCard challenge={item} index={index} key={item.id} />)}</StaggerContainer> : <EmptyResults description="Try another phrase or clear a filter to see the sample challenge set." onReset={clearFilters} title="No sample challenges match" />}
    </FeaturePage>
  )
}
