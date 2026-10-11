import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { Reveal } from '../components/marketing/Reveal'
import { Badge, Card } from '../components/ui'
import {
  dashboardDemoActivity,
  dashboardDemoOpportunities,
  dashboardDemoProgress,
  dashboardMetrics,
  type DashboardMetric,
  type DemoActivity,
  type DemoOpportunity,
  type DemoProgress,
} from './dashboard-demo-data'

function CountUp({
  suffix,
  value,
}: {
  suffix: string
  value: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.8 })
  const reduceMotion = useReducedMotion()
  const count = useMotionValue(reduceMotion ? value : 0)
  const spring = useSpring(count, { stiffness: 90, damping: 22, mass: 0.55 })
  const display = useTransform(spring, (current) => `${Math.round(current)}${suffix}`)

  useEffect(() => {
    if (reduceMotion) {
      spring.jump(value)
    } else if (isInView) {
      count.set(value)
    }
  }, [count, isInView, reduceMotion, spring, value])

  return (
    <motion.span aria-hidden="true" ref={ref}>
      {reduceMotion ? `${value}${suffix}` : display}
    </motion.span>
  )
}

function MetricCard({ metric, index }: { metric: DashboardMetric; index: number }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      aria-label={`${metric.value}${metric.suffix} ${metric.label}, demo preview`}
      className="dashboard-metric-card"
      initial={reduceMotion ? false : { opacity: 0, y: 13 }}
      transition={{
        duration: reduceMotion ? 0 : 0.42,
        delay: reduceMotion ? 0 : index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
    >
      <div className="dashboard-metric-top">
        <span className={`dashboard-metric-icon metric-icon-${index}`} aria-hidden="true">
          {metric.icon}
        </span>
        <span className="dashboard-metric-note">{metric.note}</span>
      </div>
      <p className="dashboard-metric-value">
        <CountUp suffix={metric.suffix} value={metric.value} />
      </p>
      <h2>{metric.label}</h2>
      <p className="dashboard-metric-caption">{metric.change}</p>
    </motion.article>
  )
}

function SectionHeading({
  action,
  eyebrow,
  title,
}: {
  action?: { label: string; to: string }
  eyebrow?: string
  title: string
}) {
  return (
    <div className="dashboard-section-heading">
      <div>
        {eyebrow && <p className="dashboard-section-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action && (
        <Link className="dashboard-section-action" to={action.to}>
          {action.label}
          <span aria-hidden="true">↗</span>
        </Link>
      )}
    </div>
  )
}

function ActivityFeed({ items }: { items: DemoActivity[] }) {
  return (
    <Card className="dashboard-panel">
      <SectionHeading eyebrow="A LITTLE MOMENTUM" title="Recent activity" />
      <ol className="dashboard-activity-list">
        {items.map((item, index) => (
          <li className="dashboard-activity-item" key={item.marker}>
            <span aria-hidden="true" className={`dashboard-activity-dot activity-dot-${index}`} />
            <div className="dashboard-activity-copy">
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </div>
            <span className="dashboard-demo-marker">{item.marker}</span>
          </li>
        ))}
      </ol>
    </Card>
  )
}

function ProgressSection({ items }: { items: DemoProgress[] }) {
  const reduceMotion = useReducedMotion()

  return (
    <Card className="dashboard-panel">
      <SectionHeading
        action={{ label: 'Browse assignments', to: '/practice/assignments' }}
        eyebrow="SAMPLE PATHS"
        title="Learning progress"
      />
      <div className="dashboard-progress-list">
        {items.map((item, index) => (
          <div className="dashboard-progress-item" key={item.label}>
            <div className="dashboard-progress-heading">
              <div>
                <h3>{item.label}</h3>
                <p>{item.note}</p>
              </div>
              <span>{item.value}%</span>
            </div>
            <div
              aria-label={`${item.label}: ${item.value}% demo progress`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={item.value}
              className="dashboard-progress-track"
              role="progressbar"
            >
              <motion.span
                animate={{ scaleX: item.value / 100 }}
                className={`dashboard-progress-fill progress-fill-${index}`}
                initial={reduceMotion ? false : { scaleX: 0 }}
                style={{ transformOrigin: 'left' }}
                transition={{
                  duration: reduceMotion ? 0 : 0.75,
                  delay: reduceMotion ? 0 : 0.12 * index,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="dashboard-panel-footnote">
        Progress values are illustrative and are not linked to a learner account.
      </p>
    </Card>
  )
}

function OpportunityCard({ item }: { item: DemoOpportunity }) {
  return (
    <article className="dashboard-opportunity-item">
      <div className="dashboard-opportunity-meta">
        <span>{item.category}</span>
        <span className="dashboard-demo-pill">DEMO</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="dashboard-opportunity-footer">
        <span>{item.date}</span>
        <Link aria-label={`View ${item.title} preview`} to="/discover/hackathons">
          Details <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  )
}

function UpcomingOpportunities({ items }: { items: DemoOpportunity[] }) {
  return (
    <Card className="dashboard-panel dashboard-opportunities-panel">
      <SectionHeading
        action={{ label: 'Explore hackathons', to: '/discover/hackathons' }}
        eyebrow="ILLUSTRATIVE LISTINGS"
        title="Upcoming opportunities"
      />
      <p className="dashboard-opportunity-disclaimer">
        Dates and availability are sample content, not verified events.
      </p>
      <div className="dashboard-opportunity-list">
        {items.map((item) => (
          <OpportunityCard item={item} key={item.title} />
        ))}
      </div>
    </Card>
  )
}

const quickActions = [
  {
    title: 'Find a hackathon',
    text: 'Explore event previews and prompts.',
    to: '/discover/hackathons',
    icon: '↗',
  },
  {
    title: 'Meet collaborators',
    text: 'Explore fictional team previews.',
    to: '/build/teams',
    icon: '+',
  },
  {
    title: 'Practice a skill',
    text: 'See the assignments placeholder.',
    to: '/practice/assignments',
    icon: '</>',
  },
]

function QuickActions() {
  return (
    <Card className="dashboard-panel dashboard-quick-panel">
      <SectionHeading eyebrow="GO SOMEWHERE NEXT" title="Quick actions" />
      <div className="dashboard-quick-actions">
        {quickActions.map((action, index) => (
          <Link
            className="dashboard-quick-action"
            key={action.to}
            to={action.to}
          >
            <span className={`dashboard-quick-icon quick-icon-${index}`} aria-hidden="true">
              {action.icon}
            </span>
            <span className="dashboard-quick-copy">
              <strong>{action.title}</strong>
              <small>{action.text}</small>
            </span>
            <span aria-hidden="true" className="dashboard-quick-arrow">↗</span>
          </Link>
        ))}
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="student-dashboard">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-welcome"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="dashboard-welcome-copy">
          <span className="dashboard-welcome-eyebrow">
            YOUR SPACE TO BUILD
            <span aria-hidden="true" />
            PREVIEW
          </span>
          <h2>Welcome back, Developer</h2>
          <p>
            A calm place to find your next challenge, connect with people, and
            keep learning at your own pace.
          </p>
          <div className="dashboard-welcome-actions">
            <Link className="dashboard-primary-link" to="/discover/hackathons">
              Explore hackathons <span aria-hidden="true">↗</span>
            </Link>
            <Link className="dashboard-secondary-link" to="/discover/team-matcher">
              Find teammates
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="dashboard-welcome-art">
          <span className="welcome-art-orbit welcome-orbit-one" />
          <span className="welcome-art-orbit welcome-orbit-two" />
          <span className="welcome-art-line welcome-line-one" />
          <span className="welcome-art-line welcome-line-two" />
          <span className="welcome-art-core">{'{ }'}</span>
          <span className="welcome-art-node welcome-node-one">Build</span>
          <span className="welcome-art-node welcome-node-two">Learn</span>
          <span className="welcome-art-node welcome-node-three">Share</span>
        </div>
      </motion.div>

      <div className="dashboard-demo-banner" role="note">
        <Badge variant="warning">Demo preview</Badge>
        <p>
          This dashboard uses sample content only. No account, activity, event
          availability, or live progress is connected.
        </p>
      </div>

      <section aria-label="Overview metrics" className="dashboard-metrics-grid">
        {dashboardMetrics.map((metric, index) => (
          <MetricCard index={index} key={metric.label} metric={metric} />
        ))}
      </section>

      <div className="dashboard-section-grid">
        <div className="dashboard-primary-column">
          <Reveal>
            <ActivityFeed items={dashboardDemoActivity} />
          </Reveal>
          <Reveal delay={0.08}>
            <ProgressSection items={dashboardDemoProgress} />
          </Reveal>
        </div>
        <div className="dashboard-secondary-column">
          <Reveal delay={0.04}>
            <UpcomingOpportunities items={dashboardDemoOpportunities} />
          </Reveal>
          <Reveal delay={0.1}>
            <QuickActions />
          </Reveal>
        </div>
      </div>
    </div>
  )
}
