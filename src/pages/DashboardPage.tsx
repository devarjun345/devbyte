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
import { MicroPress, MicroPressCard } from '../components/ui'
import { StaggerContainer, StaggerItem, StaggerItemArticle } from '../components/ui'
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
  return (
    <StaggerItemArticle
      aria-label={`${metric.value}${metric.suffix} ${metric.label}, demo preview`}
      className="dashboard-metric-card"
      staggerIndex={index}
      staggerMs={70}
      initialY={14}
      duration={0.38}
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
    </StaggerItemArticle>
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
      <StaggerContainer staggerMs={50} viewportAmount={0.15}>
        <ol className="dashboard-activity-list">
          {items.map((item, index) => (
            <StaggerItem
              key={item.marker}
              staggerIndex={index}
              initialY={8}
              duration={0.28}
              className="dashboard-activity-item"
            >
              <span aria-hidden="true" className={`dashboard-activity-dot activity-dot-${index}`} />
              <div className="dashboard-activity-copy">
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
              </div>
              <span className="dashboard-demo-marker">{item.marker}</span>
            </StaggerItem>
          ))}
        </ol>
      </StaggerContainer>
    </Card>
  )
}

function ProgressSection({ items }: { items: DemoProgress[] }) {
  return (
    <Card className="dashboard-panel">
      <SectionHeading
        action={{ label: 'Browse assignments', to: '/practice/assignments' }}
        eyebrow="SAMPLE PATHS"
        title="Learning progress"
      />
      <div className="dashboard-progress-list">
        {items.map((item, index) => (
          <StaggerItem
            key={item.label}
            staggerIndex={index}
            staggerMs={80}
            initialY={10}
            duration={0.32}
            className="dashboard-progress-item"
          >
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
                initial={false}
                style={{ transformOrigin: 'left' }}
                transition={{
                  duration: 0.75,
                  delay: 0.12 * index,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </StaggerItem>
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
        <MicroPress asChild>
          <Link aria-label={`View ${item.title} preview`} to="/discover/hackathons">
            Details <span aria-hidden="true">↗</span>
          </Link>
        </MicroPress>
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
      <StaggerContainer staggerMs={60} viewportAmount={0.15}>
        <div className="dashboard-opportunity-list">
          {items.map((item, index) => (
            <StaggerItem
              key={item.title}
              staggerIndex={index}
              initialY={10}
              duration={0.32}
              className="dashboard-opportunity-item"
            >
              <OpportunityCard item={item} />
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
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
      <StaggerContainer staggerMs={60} viewportAmount={0.15}>
        <div className="dashboard-quick-actions">
          {quickActions.map((action, index) => (
            <StaggerItem
              key={action.to}
              staggerIndex={index}
              initialY={8}
              duration={0.28}
              className="dashboard-quick-action-wrapper"
            >
              <MicroPressCard asChild>
                <Link className="dashboard-quick-action" to={action.to}>
                  <span className={`dashboard-quick-icon quick-icon-${index}`} aria-hidden="true">
                    {action.icon}
                  </span>
                  <span className="dashboard-quick-copy">
                    <strong>{action.title}</strong>
                    <small>{action.text}</small>
                  </span>
                  <span aria-hidden="true" className="dashboard-quick-arrow">↗</span>
                </Link>
              </MicroPressCard>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </Card>
  )
}

export function DashboardPage() {
  return (
    <div className="student-dashboard">
      <StaggerItemArticle
        className="dashboard-welcome"
        initialY={12}
        duration={0.46}
      >
        <div className="dashboard-welcome-copy">
          <span className="dashboard-welcome-eyebrow">
            YOUR SPACE TO BUILD
            <span aria-hidden="true" className="dashboard-welcome-dot" />
            PREVIEW
          </span>
          <h1>Welcome back, Developer</h1>
          <p>
            A calm place to find your next challenge, connect with people, and
            keep learning at your own pace.
          </p>
          <div className="dashboard-welcome-actions">
            <MicroPress asChild>
              <Link className="dashboard-primary-link" to="/discover/hackathons">
                Explore hackathons <span aria-hidden="true">↗</span>
              </Link>
            </MicroPress>
            <MicroPress asChild>
              <Link className="dashboard-secondary-link" to="/discover/team-matcher">
                Find teammates
              </Link>
            </MicroPress>
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
      </StaggerItemArticle>

      <div className="dashboard-demo-banner" role="note">
        <Badge variant="warning">Demo preview</Badge>
        <p>
          This dashboard uses sample content only. No account, activity, event
          availability, or live progress is connected.
        </p>
      </div>

      <section aria-label="Overview metrics" className="dashboard-metrics-grid">
        <StaggerContainer staggerMs={70} viewportAmount={0.15}>
          {dashboardMetrics.map((metric, index) => (
            <MetricCard index={index} key={metric.label} metric={metric} />
          ))}
        </StaggerContainer>
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
