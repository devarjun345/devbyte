export type HackathonStatus = 'Upcoming' | 'Ongoing' | 'Completed'
export type EventMode = 'Online' | 'Offline' | 'Hybrid'

export type DemoHackathon = {
  category: string
  description: string
  endDate: string
  id: string
  location: string
  mode: EventMode
  organizer: string
  prizes: string[]
  requirements: string[]
  startDate: string
  status: HackathonStatus
  tags: string[]
  themes: string[]
  timeline: { date: string; label: string }[]
  title: string
  eligibility: string[]
}

export const demoHackathons: DemoHackathon[] = [
  {
    id: 'open-source-weekend',
    title: 'Open Source Weekend',
    description: 'A sample three-day prompt to explore contribution workflows and build a small tool with a team.',
    organizer: 'DevByte Events · demo organizer',
    category: 'Open source',
    startDate: 'Nov 14, 2026',
    endDate: 'Nov 16, 2026',
    mode: 'Online',
    location: 'Remote · sample location',
    status: 'Upcoming',
    tags: ['Open source', 'Web', 'Beginner friendly'],
    themes: ['Developer tooling', 'Community', 'Accessibility'],
    eligibility: ['Individuals or teams of up to four in this illustrative brief.', 'All experience levels are welcome in this sample scenario.'],
    prizes: ['Demo recognition: project showcase (illustrative only).'],
    requirements: ['Submit a short project write-up.', 'Include setup instructions and a brief demo.'],
    timeline: [
      { date: 'Nov 14 · sample date', label: 'Brief opens' },
      { date: 'Nov 15 · sample date', label: 'Build check-in' },
      { date: 'Nov 16 · sample date', label: 'Demo submission' },
    ],
  },
  {
    id: 'climate-build-lab',
    title: 'Climate Build Lab',
    description: 'An illustrative design-and-code challenge focused on making complex information easier to explore.',
    organizer: 'Build Lab Collective · demo organizer',
    category: 'Climate tech',
    startDate: 'Dec 05, 2026',
    endDate: 'Dec 07, 2026',
    mode: 'Hybrid',
    location: 'Remote + sample local hubs',
    status: 'Upcoming',
    tags: ['Climate', 'Data', 'Product design'],
    themes: ['Data storytelling', 'Resource awareness', 'Community tools'],
    eligibility: ['Open to learners in this fictional sample brief.', 'Teams may be formed before or during the event.'],
    prizes: ['No verified prizes. This preview includes no real award information.'],
    requirements: ['Describe the problem and intended audience.', 'Share a clickable prototype or working demo.'],
    timeline: [
      { date: 'Dec 05 · sample date', label: 'Kickoff' },
      { date: 'Dec 06 · sample date', label: 'Mentor-style peer review' },
      { date: 'Dec 07 · sample date', label: 'Project showcase' },
    ],
  },
  {
    id: 'interface-sprint',
    title: 'Interface Sprint',
    description: 'A completed sample event brief for practicing accessible, responsive frontend implementation.',
    organizer: 'Studio Practice · demo organizer',
    category: 'Web development',
    startDate: 'Sep 18, 2026',
    endDate: 'Sep 20, 2026',
    mode: 'Offline',
    location: 'Sample venue · Portland',
    status: 'Completed',
    tags: ['Frontend', 'Accessibility', 'UI'],
    themes: ['Accessible interfaces', 'Design systems', 'Responsive layouts'],
    eligibility: ['Illustrative recap only; registration is not available.'],
    prizes: ['No real prizes are represented in this demo.'],
    requirements: ['Review semantic structure.', 'Document responsive behavior.'],
    timeline: [
      { date: 'Sep 18 · sample date', label: 'Brief released' },
      { date: 'Sep 19 · sample date', label: 'Build session' },
      { date: 'Sep 20 · sample date', label: 'Sample event ended' },
    ],
  },
  {
    id: 'prototype-hours',
    title: 'Prototype Hours',
    description: 'A currently-running sample prompt about turning a small everyday workflow into a useful prototype.',
    organizer: 'Prototype Hours · demo organizer',
    category: 'Product design',
    startDate: 'Oct 10, 2026',
    endDate: 'Oct 12, 2026',
    mode: 'Online',
    location: 'Remote · sample location',
    status: 'Ongoing',
    tags: ['Prototyping', 'Product', 'Teamwork'],
    themes: ['Useful workflows', 'Clear feedback', 'Small experiments'],
    eligibility: ['This status is illustrative and does not indicate a real event is running.'],
    prizes: ['No prize or event availability is verified.'],
    requirements: ['Create a small prototype.', 'Add a short note describing one design choice.'],
    timeline: [
      { date: 'Oct 10 · sample date', label: 'Prompt opened' },
      { date: 'Oct 11 · sample date', label: 'Sample build day' },
      { date: 'Oct 12 · sample date', label: 'Illustrative close' },
    ],
  },
]

export type DemoTeamMember = {
  initials: string
  name: string
  role: string
}

export type DemoTeam = {
  collaboration: string
  description: string
  id: string
  interests: string[]
  members: DemoTeamMember[]
  name: string
  openRoles: string[]
  project: string
  skills: string[]
  status: 'Forming' | 'Active'
}

export const demoTeams: DemoTeam[] = [
  {
    id: 'prototype-garden',
    name: 'Prototype Garden',
    project: 'Small tools for everyday learning',
    description: 'A fictional team exploring lightweight tools that help learners organize practice and share useful notes.',
    skills: ['React', 'TypeScript', 'UX research', 'Figma'],
    interests: ['Learning', 'Productivity'],
    status: 'Forming',
    collaboration: 'Remote · async-friendly',
    members: [
      { initials: 'AK', name: 'Avery Kim', role: 'Product design · demo member' },
      { initials: 'JM', name: 'Jordan Miller', role: 'Frontend · demo member' },
    ],
    openRoles: ['Backend developer', 'Accessibility-minded frontend developer'],
  },
  {
    id: 'open-map-lab',
    name: 'Open Map Lab',
    project: 'A community map prototype',
    description: 'A sample collaboration brief for making neighborhood resources easier to discover and maintain.',
    skills: ['JavaScript', 'Map APIs', 'Data visualization', 'CSS'],
    interests: ['Civic tech', 'Open data'],
    status: 'Active',
    collaboration: 'Hybrid · weekly pairing',
    members: [
      { initials: 'RS', name: 'Riley Shah', role: 'Data visualization · demo member' },
      { initials: 'ML', name: 'Morgan Lee', role: 'Frontend · demo member' },
      { initials: 'TC', name: 'Taylor Chen', role: 'Research · demo member' },
    ],
    openRoles: ['Visual design', 'Data storytelling'],
  },
  {
    id: 'friendly-compiler',
    name: 'Friendly Compiler',
    project: 'A gentle coding practice experience',
    description: 'An illustrative team project about making programming concepts easier to practice in small steps.',
    skills: ['Python', 'React', 'Content design'],
    interests: ['Developer education', 'Accessibility'],
    status: 'Forming',
    collaboration: 'Remote · flexible hours',
    members: [
      { initials: 'DP', name: 'Devon Park', role: 'Learning design · demo member' },
      { initials: 'SA', name: 'Sam Alvarez', role: 'Python · demo member' },
    ],
    openRoles: ['React developer', 'Illustration or visual design'],
  },
]

export type DemoMatchProfile = {
  compatibility: number
  id: string
  interests: string[]
  name: string
  role: string
  skills: string[]
  wantsToLearn: string[]
}

export const demoMatchProfiles: DemoMatchProfile[] = [
  {
    id: 'profile-avery',
    name: 'Avery Kim · sample profile',
    role: 'Product designer',
    skills: ['Figma', 'UX research', 'HTML'],
    wantsToLearn: ['React', 'TypeScript'],
    interests: ['Learning tools', 'Accessibility'],
    compatibility: 88,
  },
  {
    id: 'profile-jordan',
    name: 'Jordan Miller · sample profile',
    role: 'Frontend developer',
    skills: ['React', 'CSS', 'JavaScript'],
    wantsToLearn: ['Figma', 'Product thinking'],
    interests: ['Civic tech', 'Open source'],
    compatibility: 81,
  },
  {
    id: 'profile-riley',
    name: 'Riley Shah · sample profile',
    role: 'Data storyteller',
    skills: ['Python', 'Data visualization', 'SQL'],
    wantsToLearn: ['UI design', 'React'],
    interests: ['Climate tech', 'Learning tools'],
    compatibility: 76,
  },
]

export type DemoSkillSwap = {
  category: string
  id: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  offering: string
  partnerInitials: string
  partnerName: string
  seeking: string
  summary: string
}

export const demoSkillSwaps: DemoSkillSwap[] = [
  {
    id: 'react-python',
    partnerName: 'Avery Kim · sample profile',
    partnerInitials: 'AK',
    category: 'Web development',
    level: 'Intermediate',
    offering: 'React',
    seeking: 'Python',
    summary: 'Exchange component patterns and frontend fundamentals for a guided Python practice session.',
  },
  {
    id: 'ui-git',
    partnerName: 'Jordan Miller · sample profile',
    partnerInitials: 'JM',
    category: 'Design',
    level: 'Beginner',
    offering: 'UI design',
    seeking: 'Git & GitHub',
    summary: 'Share interface critique and learn the basics of collaborative version control together.',
  },
  {
    id: 'python-accessibility',
    partnerName: 'Riley Shah · sample profile',
    partnerInitials: 'RS',
    category: 'Data & accessibility',
    level: 'Advanced',
    offering: 'Python',
    seeking: 'Accessibility testing',
    summary: 'Practice data scripting alongside practical accessibility review techniques.',
  },
  {
    id: 'figma-typescript',
    partnerName: 'Morgan Lee · sample profile',
    partnerInitials: 'ML',
    category: 'Frontend',
    level: 'Intermediate',
    offering: 'Figma',
    seeking: 'TypeScript',
    summary: 'Trade a small design-system walkthrough for a TypeScript fundamentals session.',
  },
]
