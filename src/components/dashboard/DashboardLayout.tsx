import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from 'motion/react'
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { DevByteLogo } from '../brand/DevByteLogo'
import { PageTransition } from '../layout/PageTransition'

type NavigationIcon =
  | 'dashboard'
  | 'calendar'
  | 'people'
  | 'match'
  | 'swap'
  | 'mentor'
  | 'teams'
  | 'assignment'
  | 'battle'
  | 'profile'
  | 'settings'

type NavigationItem = {
  icon: NavigationIcon
  label: string
  to: string
}

const navigationGroups: { label: string; items: NavigationItem[] }[] = [
  {
    label: 'Workspace',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: 'dashboard' }],
  },
  {
    label: 'Discover',
    items: [
      { label: 'Hackathons', to: '/discover/hackathons', icon: 'calendar' },
      { label: 'AI Team Matcher', to: '/discover/team-matcher', icon: 'match' },
      { label: 'Skill Swap', to: '/discover/skill-swap', icon: 'swap' },
      { label: 'Mentors', to: '/discover/mentors', icon: 'mentor' },
    ],
  },
  {
    label: 'Build',
    items: [{ label: 'Teams', to: '/build/teams', icon: 'people' }],
  },
  {
    label: 'Practice',
    items: [
      { label: 'Assignments', to: '/practice/assignments', icon: 'assignment' },
      { label: 'Battle Arena', to: '/practice/battle-arena', icon: 'battle' },
    ],
  },
  {
    label: 'Grow',
    items: [{ label: 'AI Mentor', to: '/grow/ai-mentor', icon: 'mentor' }],
  },
]

const accountItems: NavigationItem[] = [
  { label: 'Profile', to: '/profile', icon: 'profile' },
  { label: 'Settings', to: '/settings', icon: 'settings' },
]

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/discover/hackathons': 'Hackathons',
  '/discover/team-matcher': 'AI Team Matcher',
  '/discover/skill-swap': 'Skill Swap',
  '/discover/mentors': 'Mentors',
  '/build/teams': 'Teams',
  '/practice/assignments': 'Assignments',
  '/practice/battle-arena': 'Battle Arena',
  '/grow/ai-mentor': 'AI Mentor',
  '/profile': 'Profile',
  '/settings': 'Settings',
}

function getPageTitle(pathname: string) {
  const routePath = pathname.replace(/\/+$/, '') || '/'
  if (pageTitles[routePath]) return pageTitles[routePath]
  if (routePath.startsWith('/discover/hackathons/')) return 'Hackathon details'
  if (routePath.startsWith('/discover/mentors/')) {
    return routePath.endsWith('/book') ? 'Booking preview' : 'Mentor profile'
  }
  if (routePath.startsWith('/practice/battle-arena/')) return 'Challenge workspace'
  if (routePath.startsWith('/practice/assignments/')) return 'Assignment details'
  if (routePath.startsWith('/discover/skill-swap/')) {
    return routePath.endsWith('/request') ? 'Exchange request preview' : 'Exchange details'
  }
  if (routePath.startsWith('/build/teams/')) {
    if (routePath.endsWith('/join')) return 'Join request preview'
    if (routePath.endsWith('/new')) return 'Create team preview'
    return 'Team details'
  }
  return 'Workspace'
}

const iconPaths: Record<NavigationIcon, string> = {
  dashboard: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  calendar: 'M5 6h14v14H5zM8 3v6M16 3v6M5 10h14',
  people: 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20zM10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM16 4.3a3.5 3.5 0 0 1 0 6.8M17 15h1.5a3.5 3.5 0 0 1 3.5 3.5V20',
  match: 'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8M12 9l2 3-2 3-2-3z',
  swap: 'M7 7h13l-3-3M17 17H4l3 3M20 7l-3 3M4 17l3-3',
  mentor: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18M12 9v6M9 12h6',
  teams: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0M18 8h4M20 6v4',
  assignment: 'M7 4h10v16H7zM10 8h4M10 12h4M10 16h4M5 7H4v13h10v-1',
  battle: 'm13 2-9 12h7l-1 8 10-13h-7z',
  profile: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM19 13.5l2-1.5-2-1.5-.4-2.1-2.4-.4L15 6l-2-1-1 2-2 .4-.4 2.4L8 11l-1 2 2 1 .4 2.2 2.4.4L13 19l2 1 1-2 2-.4z',
}

function NavigationGlyph({ icon }: { icon: NavigationIcon }) {
  return (
    <svg
      aria-hidden="true"
      className="dashboard-nav-glyph"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d={iconPaths[icon]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function SidebarNavigation({
  mobile,
  onNavigate,
}: {
  mobile: boolean
  onNavigate: () => void
}) {
  const reduceMotion = useReducedMotion()

  function renderItem(item: NavigationItem) {
    return (
      <li key={item.to}>
        <NavLink
          className={({ isActive }) =>
            `dashboard-nav-link${isActive ? ' is-active' : ''}`
          }
          end={item.to === '/dashboard'}
          onClick={onNavigate}
          to={item.to}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  className="dashboard-nav-active-indicator"
                  layoutId={mobile ? 'mobile-dashboard-active' : 'desktop-dashboard-active'}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 320, damping: 30 }
                  }
                />
              )}
              <NavigationGlyph icon={item.icon} />
              <span>{item.label}</span>
            </>
          )}
        </NavLink>
      </li>
    )
  }

  return (
    <nav aria-label="Dashboard navigation" className="dashboard-sidebar-navigation">
      {navigationGroups.map((group) => (
        <section className="dashboard-nav-group" key={group.label}>
          <h2>{group.label}</h2>
          <ul>{group.items.map(renderItem)}</ul>
        </section>
      ))}
      <section className="dashboard-nav-group dashboard-account-group">
        <h2>Account</h2>
        <ul>{accountItems.map(renderItem)}</ul>
      </section>
    </nav>
  )
}

function DashboardSidebar({
  mobile = false,
  onClose,
}: {
  mobile?: boolean
  onClose?: () => void
}) {
  return (
    <aside
      aria-label={mobile ? 'Mobile dashboard navigation' : 'Dashboard sidebar'}
      className={`dashboard-sidebar${mobile ? ' dashboard-sidebar-mobile' : ''}`}
    >
      <div className="dashboard-sidebar-brand-row">
        <Link
          aria-label="DEV BYTE home"
          className="dashboard-sidebar-brand"
          onClick={onClose}
          to="/"
        >
          <DevByteLogo size={35} />
        </Link>
        {mobile && (
          <button
            aria-label="Close navigation"
            className="dashboard-icon-button dashboard-mobile-close"
            onClick={onClose}
            type="button"
          >
            <CloseIcon />
          </button>
        )}
      </div>
      <SidebarNavigation
        mobile={mobile}
        onNavigate={() => onClose?.()}
      />
      <p className="dashboard-sidebar-note">A place to keep building.</p>
    </aside>
  )
}

function DashboardMobilePanel({
  children,
  panelRef,
  reduceMotion,
}: {
  children: ReactNode
  panelRef: RefObject<HTMLDivElement | null>
  reduceMotion: boolean | null
}) {
  const isPresent = useIsPresent()

  return (
    <motion.div
      animate={{ x: 0 }}
      aria-hidden={!isPresent}
      aria-label={isPresent ? 'Dashboard navigation' : undefined}
      aria-modal={isPresent || undefined}
      className="dashboard-mobile-panel"
      exit={{ x: '-100%' }}
      id="dashboard-mobile-navigation"
      inert={!isPresent}
      initial={reduceMotion ? false : { x: '-100%' }}
      ref={panelRef}
      role={isPresent ? 'dialog' : undefined}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 300, damping: 32 }
      }
    >
      {children}
    </motion.div>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.7" />
      <path d="m15.5 15.5 4.2 4.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  )
}

function DashboardHeader({
  mobileOpen,
  mobileTriggerRef,
  onMobileToggle,
  isDashboard,
  title,
}: {
  mobileOpen: boolean
  mobileTriggerRef: RefObject<HTMLButtonElement | null>
  onMobileToggle: () => void
  isDashboard: boolean
  title: string
}) {
  const reduceMotion = useReducedMotion()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const allItems = [...navigationGroups.flatMap((group) => group.items), ...accountItems]
  const results = searchQuery.trim()
    ? allItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : []

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (!notificationRef.current?.contains(target)) setNotificationOpen(false)
      if (!profileRef.current?.contains(target)) setProfileOpen(false)
      if (!searchRef.current?.contains(target)) setSearchOpen(false)
    }
    window.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => window.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [])

  useEffect(() => {
    function focusDashboardSearch(event: globalThis.KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') {
        return
      }
      event.preventDefault()
      searchInputRef.current?.focus()
    }
    window.addEventListener('keydown', focusDashboardSearch)
    return () => window.removeEventListener('keydown', focusDashboardSearch)
  }, [])

  const searchShortcutLabel = window.navigator.platform
    .toLowerCase()
    .includes('mac')
    ? '⌘ K'
    : 'Ctrl K'

  useEffect(() => {
    function closePopoversOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return
      setNotificationOpen(false)
      setProfileOpen(false)
      setSearchOpen(false)
      searchInputRef.current?.blur()
    }
    window.addEventListener('keydown', closePopoversOnEscape)
    return () => window.removeEventListener('keydown', closePopoversOnEscape)
  }, [])

  return (
    <header className="dashboard-topbar">
      <button
        aria-controls="dashboard-mobile-navigation"
        aria-expanded={mobileOpen}
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
        className="dashboard-mobile-trigger dashboard-icon-button"
        onClick={onMobileToggle}
        ref={mobileTriggerRef}
        type="button"
      >
        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
      <div className="dashboard-topbar-title">
        <span className="dashboard-breadcrumb">DEV BYTE / WORKSPACE</span>
        {isDashboard ? (
          <h1>{title}</h1>
        ) : (
          <p className="dashboard-topbar-page-label">{title}</p>
        )}
      </div>
      <div className="dashboard-topbar-actions">
        <div className="dashboard-search" ref={searchRef}>
          <SearchIcon />
          <input
            aria-label="Search dashboard sections"
            aria-controls="dashboard-search-results"
            aria-expanded={searchOpen && searchQuery.trim().length > 0}
            autoComplete="off"
            onBlur={() => {
              window.setTimeout(() => {
                if (!searchRef.current?.contains(document.activeElement)) {
                  setSearchOpen(false)
                }
              }, 120)
            }}
            onChange={(event) => {
              setSearchQuery(event.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => {
              if (searchQuery.trim()) setSearchOpen(true)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setSearchOpen(false)
                searchInputRef.current?.blur()
              }
            }}
            placeholder="Search sections"
            ref={searchInputRef}
            role="searchbox"
            type="search"
            value={searchQuery}
          />
          <kbd>{searchShortcutLabel}</kbd>
          <AnimatePresence>
            {searchOpen && searchQuery.trim() && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="dashboard-search-results"
                exit={{ opacity: 0, y: -5 }}
                id="dashboard-search-results"
                initial={{ opacity: 0, y: -5 }}
                transition={{ duration: reduceMotion ? 0 : 0.16 }}
              >
                <p>Local navigation suggestions</p>
                {results.length ? (
                  results.map((item) => (
                    <Link
                      aria-label={`Go to ${item.label}`}
                      className="dashboard-search-result"
                      key={item.to}
                      onClick={() => {
                        setSearchQuery('')
                        setSearchOpen(false)
                      }}
                      to={item.to}
                    >
                      <NavigationGlyph icon={item.icon} />
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <span className="dashboard-search-empty">No matching sections.</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="dashboard-popover-anchor" ref={notificationRef}>
          <button
            aria-controls="dashboard-notifications"
            aria-expanded={notificationOpen}
            aria-label="Notifications"
            className="dashboard-icon-button"
            onClick={() => {
              setNotificationOpen((open) => !open)
              setProfileOpen(false)
            }}
            type="button"
          >
            <BellIcon />
          </button>
          <AnimatePresence>
            {notificationOpen && (
              <motion.div
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="dashboard-popover dashboard-notification-popover"
                exit={{ opacity: 0, y: -5, scale: 0.98 }}
                id="dashboard-notifications"
                initial={{ opacity: 0, y: -5, scale: 0.98 }}
                role="status"
                transition={{ duration: reduceMotion ? 0 : 0.16 }}
              >
                <strong>Notifications</strong>
                <p>Notifications are not connected in this preview.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="dashboard-popover-anchor" ref={profileRef}>
          <button
            aria-controls="dashboard-profile-menu"
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
            className="dashboard-profile-button"
            onClick={() => {
              setProfileOpen((open) => !open)
              setNotificationOpen(false)
            }}
            type="button"
          >
            <span aria-hidden="true" className="dashboard-avatar">DB</span>
            <span className="dashboard-profile-name">Developer preview</span>
            <span aria-hidden="true" className="dashboard-profile-chevron">⌄</span>
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="dashboard-popover dashboard-profile-popover"
                exit={{ opacity: 0, y: -5 }}
                id="dashboard-profile-menu"
                initial={{ opacity: 0, y: -5 }}
                transition={{ duration: reduceMotion ? 0 : 0.16 }}
              >
                <span className="dashboard-profile-preview">No account connected</span>
                <Link to="/profile">Profile</Link>
                <Link to="/settings">Settings</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export function DashboardLayout() {
  const { pathname } = useLocation()
  const reduceMotion = useReducedMotion()
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobilePanelRef = useRef<HTMLDivElement>(null)
  const mobileTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!mobileOpen) return
    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const frameId = window.requestAnimationFrame(() => {
      mobilePanelRef.current
        ?.querySelector<HTMLElement>('.dashboard-mobile-close')
        ?.focus()
    })
    function handleMobileKeys(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        mobileTriggerRef.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !mobilePanelRef.current) return
      const focusable = Array.from(
        mobilePanelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', handleMobileKeys)
    return () => {
      document.body.style.overflow = previousBodyOverflow
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('keydown', handleMobileKeys)
    }
  }, [mobileOpen])

  useEffect(() => {
    document.title = `${getPageTitle(pathname)} — DEV BYTE`
  }, [pathname])

  function closeMobileNavigation() {
    setMobileOpen(false)
    window.requestAnimationFrame(() => mobileTriggerRef.current?.focus())
  }

  const title = getPageTitle(pathname)

  return (
    <div className="dashboard-shell">
      <div className="dashboard-desktop-sidebar">
        <DashboardSidebar onClose={() => undefined} />
      </div>
      <div className="dashboard-workspace">
        <DashboardHeader
          key={pathname}
          isDashboard={pathname === '/dashboard'}
          mobileOpen={mobileOpen}
          mobileTriggerRef={mobileTriggerRef}
          onMobileToggle={() => {
            if (mobileOpen) closeMobileNavigation()
            else setMobileOpen(true)
          }}
          title={title}
        />
        <main className="dashboard-content">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="dashboard-mobile-overlay"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            <button
              aria-label="Close navigation"
              className="dashboard-mobile-scrim"
              onClick={closeMobileNavigation}
              tabIndex={-1}
              type="button"
            />
            <DashboardMobilePanel panelRef={mobilePanelRef} reduceMotion={reduceMotion}>
              <DashboardSidebar mobile onClose={closeMobileNavigation} />
            </DashboardMobilePanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  )
}
