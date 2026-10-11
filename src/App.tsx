import type { ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router'
import { Badge, Card, LoadingIndicator, PageHeading } from './components/ui'
import { PageContainer } from './components/layout/PageContainer'
import { DevByteLogo } from './components/brand/DevByteLogo'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { Reveal } from './components/marketing/Reveal'

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
)
const AIMentorPage = lazy(() =>
  import('./pages/AIMentorPage').then((module) => ({
    default: module.AIMentorPage,
  })),
)
const AssignmentsPage = lazy(() =>
  import('./pages/AssignmentsPage').then((module) => ({
    default: module.AssignmentsPage,
  })),
)
const BattleArenaPage = lazy(() =>
  import('./pages/BattleArenaPage').then((module) => ({
    default: module.BattleArenaPage,
  })),
)
const HackathonsPage = lazy(() =>
  import('./pages/HackathonsPage').then((module) => ({
    default: module.HackathonsPage,
  })),
)
const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((module) => ({
    default: module.LandingPage,
  })),
)
const MentorsPage = lazy(() =>
  import('./pages/MentorsPage').then((module) => ({
    default: module.MentorsPage,
  })),
)
const SignupPage = lazy(() =>
  import('./pages/SignupPage').then((module) => ({
    default: module.SignupPage,
  })),
)
const SkillSwapPage = lazy(() =>
  import('./pages/SkillSwapPage').then((module) => ({
    default: module.SkillSwapPage,
  })),
)
const TeamMatcherPage = lazy(() =>
  import('./pages/TeamMatcherPage').then((module) => ({
    default: module.TeamMatcherPage,
  })),
)
const TeamsPage = lazy(() =>
  import('./pages/TeamsPage').then((module) => ({
    default: module.TeamsPage,
  })),
)

const placeholderPages: Record<string, { title: string; description: string }> =
  {
    '/profile': {
      title: 'Profile',
      description: 'Profile settings are not connected to an account yet.',
    },
    '/settings': {
      title: 'Settings',
      description: 'Account settings are not implemented yet.',
    },
  }

function Brand() {
  return (
    <Link
      aria-label="DEV BYTE home"
      className="inline-flex min-h-11 items-center gap-3 rounded-md text-black no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage-green"
      to="/"
    >
      <DevByteLogo size={36} />
    </Link>
  )
}

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-soft-white text-black">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex min-h-16 max-w-screen-xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Brand />
          <Link
            className="inline-flex min-h-11 items-center rounded-md px-4 text-sm font-semibold text-deep-olive underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-green"
            to="/login"
          >
            Login
          </Link>
        </div>
      </header>
      <main className="py-12 sm:py-16">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  )
}

function LoginPlaceholder() {
  return (
    <div className="mx-auto max-w-xl">
      <Reveal>
        <PageHeading
          description="Authentication is not connected. This page is a route placeholder only."
          eyebrow="Authentication not implemented"
          title="Login"
        />
      </Reveal>
      <Reveal delay={0.08}>
        <Card className="mt-8">
          <Badge variant="warning">Authentication not implemented</Badge>
          <p className="mt-4 text-sm leading-6 text-secondary-text">
            No login form or simulated sign-in is available in this phase.
          </p>
        </Card>
      </Reveal>
    </div>
  )
}

function RoutePlaceholder() {
  const { pathname } = useLocation()
  const page = placeholderPages[pathname]

  if (!page) {
    return (
      <PageHeading
        description="The requested page is not part of the current application routes."
        title="Page not found"
      />
    )
  }

  return (
    <div className="max-w-3xl">
      <PageHeading
        description={page.description}
        eyebrow="Feature not implemented"
        title={page.title}
      />
      <Card className="mt-8">
        <Badge variant="neutral">Temporary placeholder</Badge>
        <p className="mt-4 text-sm leading-6 text-secondary-text">
          This route is registered, but its feature screen and functionality
          have not been implemented. No sample data or backend behavior is
          shown.
        </p>
      </Card>
    </div>
  )
}

function AppRoutes() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[50vh] items-center justify-center p-6">
          <LoadingIndicator label="Loading page" />
        </main>
      }
    >
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/signup"
          element={<SignupPage />}
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <LoginPlaceholder />
            </PublicLayout>
          }
        />
        <Route element={<DashboardLayout />}>
          <Route element={<DashboardPage />} path="/dashboard" />
          <Route element={<HackathonsPage />} path="/discover/hackathons" />
          <Route element={<HackathonsPage />} path="/discover/hackathons/:hackathonId" />
          <Route element={<MentorsPage />} path="/discover/mentors" />
          <Route element={<MentorsPage />} path="/discover/mentors/:mentorId" />
          <Route element={<MentorsPage />} path="/discover/mentors/:mentorId/book" />
          <Route element={<TeamMatcherPage />} path="/discover/team-matcher" />
          <Route element={<SkillSwapPage />} path="/discover/skill-swap" />
          <Route element={<SkillSwapPage />} path="/discover/skill-swap/:exchangeId" />
          <Route element={<SkillSwapPage />} path="/discover/skill-swap/:exchangeId/request" />
          <Route element={<TeamsPage />} path="/build/teams" />
          <Route element={<TeamsPage />} path="/build/teams/new" />
          <Route element={<TeamsPage />} path="/build/teams/:teamId" />
          <Route element={<TeamsPage />} path="/build/teams/:teamId/join" />
          <Route element={<AssignmentsPage />} path="/practice/assignments" />
          <Route element={<AssignmentsPage />} path="/practice/assignments/:assignmentId" />
          <Route element={<BattleArenaPage />} path="/practice/battle-arena" />
          <Route element={<BattleArenaPage />} path="/practice/battle-arena/:challengeId" />
          <Route element={<AIMentorPage />} path="/grow/ai-mentor" />
          {Object.keys(placeholderPages).map((path) => (
            <Route element={<RoutePlaceholder />} key={path} path={path} />
          ))}
        </Route>
        <Route
          path="*"
          element={
            <PublicLayout>
              <RoutePlaceholder />
            </PublicLayout>
          }
        />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
