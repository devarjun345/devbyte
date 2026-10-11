export type DemoMentor = {
  availability: string[]
  background: string
  category: string
  experience: number
  highlights: { description: string; title: string }[]
  id: string
  introduction: string
  name: string
  rating: number
  reviewCount: number
  role: string
  skills: string[]
  level: string
}

export const demoMentors: DemoMentor[] = [
  {
    id: 'maya-chen',
    name: 'Maya Chen',
    role: 'Staff frontend engineer · fictional profile',
    category: 'Frontend engineering',
    experience: 8,
    level: 'Senior',
    rating: 4.9,
    reviewCount: 24,
    introduction: 'I enjoy helping developers turn complex interface ideas into thoughtful, accessible products. My sample profile focuses on practical feedback and steady growth.',
    background: 'Illustrative background: building design systems, coaching cross-functional teams, and improving frontend accessibility practices.',
    skills: ['React', 'TypeScript', 'Accessibility', 'Design systems'],
    availability: ['Tue · 10:00 AM', 'Wed · 2:30 PM', 'Fri · 11:00 AM'],
    highlights: [
      { title: 'Component foundations', description: 'A fictional design-system project focused on clear component boundaries and accessible defaults.' },
      { title: 'Inclusive product patterns', description: 'An illustrative collection of keyboard-friendly interaction patterns.' },
    ],
  },
  {
    id: 'omar-patel',
    name: 'Omar Patel',
    role: 'Data engineer · fictional profile',
    category: 'Data & backend',
    experience: 6,
    level: 'Senior',
    rating: 4.8,
    reviewCount: 18,
    introduction: 'I like making data systems easier to understand, from first SQL queries to reliable pipeline design. This fictional profile demonstrates a mentoring focus.',
    background: 'Illustrative background: data modeling, Python tooling, analytics pipelines, and helping teams reason about maintainable systems.',
    skills: ['Python', 'SQL', 'Data modeling', 'ETL'],
    availability: ['Mon · 1:00 PM', 'Thu · 9:30 AM', 'Fri · 3:00 PM'],
    highlights: [
      { title: 'Learning data pipeline', description: 'A sample project that demonstrates clear stages and observable transformations.' },
      { title: 'Query practice kit', description: 'An illustrative set of SQL exercises for exploring data modeling decisions.' },
    ],
  },
  {
    id: 'elena-garcia',
    name: 'Elena Garcia',
    role: 'Product designer · fictional profile',
    category: 'Product design',
    experience: 5,
    level: 'Mid-level',
    rating: 4.7,
    reviewCount: 15,
    introduction: 'I help teams make early product ideas concrete through user-centered questions, quick prototypes, and useful critique.',
    background: 'Illustrative background: interaction design, usability studies, prototyping, and collaboration with engineering teams.',
    skills: ['Figma', 'UX research', 'Prototyping', 'Design critique'],
    availability: ['Tue · 4:00 PM', 'Wed · 10:30 AM', 'Sat · 11:00 AM'],
    highlights: [
      { title: 'Research-to-prototype flow', description: 'A sample case study showing how interview notes can shape a small prototype.' },
      { title: 'Learning dashboard concept', description: 'An illustrative student dashboard exploration with responsive states.' },
    ],
  },
  {
    id: 'noah-williams',
    name: 'Noah Williams',
    role: 'Software engineer · fictional profile',
    category: 'Career & interviews',
    experience: 4,
    level: 'Mid-level',
    rating: 4.6,
    reviewCount: 12,
    introduction: 'I enjoy helping early-career developers explain their work with confidence and build a sustainable interview practice routine.',
    background: 'Illustrative background: full-stack product teams, peer interview practice, and portfolio storytelling.',
    skills: ['JavaScript', 'Node.js', 'Interview prep', 'Portfolio review'],
    availability: ['Mon · 5:00 PM', 'Thu · 2:00 PM', 'Sun · 10:00 AM'],
    highlights: [
      { title: 'Portfolio story map', description: 'A sample framework for making project decisions and outcomes easier to communicate.' },
      { title: 'Interview practice loop', description: 'An illustrative routine that emphasizes reflection and repeatable practice.' },
    ],
  },
]

export type MentorSession = {
  duration: number
  label: string
  priceNote: string
}

export const mentorSessions: MentorSession[] = [
  { duration: 30, label: 'Focused conversation', priceNote: 'Demo session format · no payment' },
  { duration: 45, label: 'Project feedback', priceNote: 'Demo session format · no payment' },
  { duration: 60, label: 'Deep-dive session', priceNote: 'Demo session format · no payment' },
]

export const bookingDates = ['Oct 15, 2026', 'Oct 17, 2026', 'Oct 20, 2026']
export const mentorDemoSlots = ['10:00 AM', '1:30 PM', '4:00 PM']

export type MentorChatTopic = 'career' | 'dsa' | 'portfolio' | 'interview' | 'general'

export function getMentorDemoReply(message: string) {
  const text = message.toLowerCase()
  if (text.includes('dsa') || text.includes('algorithm') || text.includes('data structure')) {
    return 'Sample idea: choose one pattern (such as two pointers), solve a small example by hand, then explain the invariant before coding. This is a fixed illustrative response, not generated advice.'
  }
  if (text.includes('portfolio') || text.includes('project')) {
    return 'Sample idea: make one project easy to scan—state the problem, your role, a key trade-off, and what you would improve next. This is a fixed illustrative response, not generated advice.'
  }
  if (text.includes('interview')) {
    return 'Sample idea: practice a short project story, then rehearse clarifying questions and a calm problem-solving narration. This is a fixed illustrative response, not generated advice.'
  }
  if (text.includes('career') || text.includes('job') || text.includes('role')) {
    return 'Sample idea: list the work you enjoy, the skills you want to use, and one small experiment you could try this week. This is a fixed illustrative response, not generated advice.'
  }
  return 'Sample coaching prompt: break your goal into one question, one small practice step, and one reflection. This is a fixed illustrative response; no AI service was contacted.'
}
