export type DashboardMetric = {
  change: string
  icon: string
  label: string
  note: string
  suffix: string
  value: number
}

export type DemoActivity = {
  detail: string
  label: string
  marker: string
}

export type DemoOpportunity = {
  category: string
  date: string
  description: string
  title: string
}

export type DemoProgress = {
  label: string
  note: string
  value: number
}

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: 'Active projects',
    value: 2,
    suffix: '',
    change: 'Sample project spaces',
    note: 'Preview count',
    icon: '⌘',
  },
  {
    label: 'Upcoming hackathons',
    value: 3,
    suffix: '',
    change: 'Illustrative listings',
    note: 'Preview count',
    icon: '↗',
  },
  {
    label: 'Team connections',
    value: 5,
    suffix: '',
    change: 'Sample dashboard items',
    note: 'Preview count',
    icon: '+',
  },
  {
    label: 'Learning progress',
    value: 68,
    suffix: '%',
    change: 'Across demo practice paths',
    note: 'Preview estimate',
    icon: '</>',
  },
]

export const dashboardDemoActivity: DemoActivity[] = [
  {
    label: 'Practice session completed',
    detail: 'JavaScript array methods · sample activity',
    marker: 'DEMO 01',
  },
  {
    label: 'Team space created',
    detail: 'Prototype Lab · sample project',
    marker: 'DEMO 02',
  },
  {
    label: 'Opportunity saved',
    detail: 'Open Source Sprint · demo listing',
    marker: 'DEMO 03',
  },
]

export const dashboardDemoOpportunities: DemoOpportunity[] = [
  {
    title: 'Open Source Sprint',
    category: 'COLLABORATION',
    date: 'Nov 08 · sample date',
    description: 'A preview event for practicing contribution workflows.',
  },
  {
    title: 'Frontend Foundations Jam',
    category: 'WEB DEVELOPMENT',
    date: 'Nov 19 · sample date',
    description: 'An illustrative prompt for building a thoughtful interface.',
  },
  {
    title: 'Build for Tomorrow',
    category: 'PRODUCT DESIGN',
    date: 'Dec 02 · sample date',
    description: 'A demo listing about turning a small idea into a prototype.',
  },
]

export const dashboardDemoProgress: DemoProgress[] = [
  { label: 'Problem solving', note: 'Demo learning path', value: 68 },
  { label: 'React essentials', note: 'Demo learning path', value: 42 },
  { label: 'Interface foundations', note: 'Demo learning path', value: 80 },
]
