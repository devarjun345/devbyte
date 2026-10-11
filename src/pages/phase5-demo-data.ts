export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard'

export type DemoChallenge = {
  constraints: string[]
  description: string
  difficulty: ChallengeDifficulty
  duration: number
  examples: { input: string; output: string; explanation: string }[]
  id: string
  starterCode: Record<string, string>
  title: string
  topics: string[]
}

export const demoChallenges: DemoChallenge[] = [
  {
    id: 'pair-sum',
    title: 'Pair Sum',
    difficulty: 'Easy',
    duration: 20,
    topics: ['Arrays', 'Hash map'],
    description: 'Given a list of integers and a target, return the indices of two different values whose sum equals the target. Assume exactly one answer exists.',
    examples: [
      { input: 'values = [4, 8, 3, 9], target = 12', output: '[0, 1]', explanation: 'values[0] + values[1] equals 12.' },
      { input: 'values = [6, 2, 7], target = 9', output: '[1, 2]', explanation: 'values[1] + values[2] equals 9.' },
    ],
    constraints: ['2 ≤ values.length ≤ 10,000', '-10⁶ ≤ values[i] ≤ 10⁶', 'Each input has exactly one valid pair.'],
    starterCode: {
      JavaScript: 'function pairSum(values, target) {\n  // Return the indices of the matching pair.\n  return [];\n}',
      TypeScript: 'function pairSum(values: number[], target: number): number[] {\n  // Return the indices of the matching pair.\n  return [];\n}',
      Python: 'def pair_sum(values, target):\n    # Return the indices of the matching pair.\n    return []',
    },
  },
  {
    id: 'balanced-labels',
    title: 'Balanced Labels',
    difficulty: 'Medium',
    duration: 35,
    topics: ['Strings', 'Stack'],
    description: 'Given a string containing round, square, and curly brackets, decide whether every opening bracket is closed in the correct order.',
    examples: [
      { input: 'text = "{[()]}"', output: 'true', explanation: 'Every bracket closes in last-opened-first order.' },
      { input: 'text = "[(])"', output: 'false', explanation: 'The square bracket closes before the inner round bracket.' },
    ],
    constraints: ['0 ≤ text.length ≤ 20,000', 'text contains only () [] {} characters.'],
    starterCode: {
      JavaScript: 'function hasBalancedLabels(text) {\n  // Return true when all bracket pairs are valid.\n  return false;\n}',
      TypeScript: 'function hasBalancedLabels(text: string): boolean {\n  // Return true when all bracket pairs are valid.\n  return false;\n}',
      Python: 'def has_balanced_labels(text):\n    # Return true when all bracket pairs are valid.\n    return False',
    },
  },
  {
    id: 'island-count',
    title: 'Count Connected Cells',
    difficulty: 'Hard',
    duration: 50,
    topics: ['Graph traversal', 'Matrix'],
    description: 'Count the groups of connected active cells in a rectangular grid. Cells connect horizontally or vertically, not diagonally.',
    examples: [
      { input: 'grid = [[1,1,0],[0,1,0],[1,0,1]]', output: '3', explanation: 'Three separate groups of active cells are present.' },
    ],
    constraints: ['1 ≤ rows, columns ≤ 500', 'Each cell is either 0 (inactive) or 1 (active).'],
    starterCode: {
      JavaScript: 'function countGroups(grid) {\n  // Count groups connected horizontally or vertically.\n  return 0;\n}',
      TypeScript: 'function countGroups(grid: number[][]): number {\n  // Count groups connected horizontally or vertically.\n  return 0;\n}',
      Python: 'def count_groups(grid):\n    # Count groups connected horizontally or vertically.\n    return 0',
    },
  },
]

export type AssignmentStatus = 'Not Started' | 'In Progress' | 'Submitted'

export type DemoAssignment = {
  course: string
  description: string
  dueDate: string
  id: string
  instructions: string[]
  priority: 'Standard' | 'Priority'
  progress: number
  requirements: string[]
  status: AssignmentStatus
  title: string
}

export const demoAssignments: DemoAssignment[] = [
  {
    id: 'accessible-profile-card',
    title: 'Accessible Profile Card',
    description: 'Build a responsive profile card that communicates identity and actions clearly to all users.',
    course: 'Interface foundations',
    dueDate: 'Oct 18, 2026',
    status: 'In Progress',
    priority: 'Priority',
    progress: 60,
    instructions: ['Create a semantic, keyboard-friendly profile card.', 'Adapt the layout for narrow and wide screens.', 'Explain one accessibility decision in your response.'],
    requirements: ['Use meaningful HTML landmarks and labels.', 'Provide visible keyboard focus.', 'Check the layout at mobile and desktop widths.'],
  },
  {
    id: 'array-practice-notes',
    title: 'Array Practice Notes',
    description: 'Work through a short set of array transformations and explain the approach you chose.',
    course: 'JavaScript practice',
    dueDate: 'Oct 22, 2026',
    status: 'Not Started',
    priority: 'Standard',
    progress: 0,
    instructions: ['Choose one array transformation prompt.', 'Describe the input, output, and key steps.', 'Include a small example in your response.'],
    requirements: ['Explain the reasoning in your own words.', 'Include at least one input/output example.'],
  },
  {
    id: 'react-component-reflection',
    title: 'React Component Reflection',
    description: 'Describe how a small UI component can stay focused, reusable, and straightforward to test.',
    course: 'React essentials',
    dueDate: 'Oct 28, 2026',
    status: 'Submitted',
    priority: 'Standard',
    progress: 100,
    instructions: ['Select a simple interface component.', 'Describe its responsibilities and expected states.'],
    requirements: ['Keep the response under 500 words.', 'Identify one useful component boundary.'],
  },
  {
    id: 'data-story-sketch',
    title: 'Data Story Sketch',
    description: 'Plan a small data visualization and note how labels and context help a reader interpret it.',
    course: 'Data storytelling',
    dueDate: 'Nov 02, 2026',
    status: 'In Progress',
    priority: 'Standard',
    progress: 35,
    instructions: ['Choose a small sample dataset or invented exercise values.', 'Sketch a chart and explain its audience.'],
    requirements: ['Use clear labels.', 'Describe one limitation of the chosen visualization.'],
  },
]
