# DevByte — Manual Frontend Testing Checklist

**Purpose:** Browser-only checks to be performed manually by the project
owner. This checklist contains no new test results. Do not mark PASS, FAIL, or
NOT APPLICABLE until you perform the listed check and record what you saw.

**Scope:** Frontend rendering, navigation, forms, visible local/demo
interactions, and responsive layouts. No backend/API behavior is tested or
implied.

## How to record each test

For each item, select exactly one status:

- [ ] NOT TESTED
- [ ] PASS
- [ ] FAIL
- [ ] NOT APPLICABLE

**My observations:** ________________________________________________

**Reproduction notes / viewport / URL:** ______________________________

Previous audits contain historical evidence (40 direct URL/refresh checks,
the eight major navigation journeys, feature-flow samples, and responsive
samples). That evidence is not your new manual result. Start this checklist
with every item as **NOT TESTED** and update it only after personally checking
the browser.

Suggested local start command, from the project root:

```sh
npm run dev
```

Open the local URL Vite prints in your browser. For a direct-route test, paste
the full route in the address bar, wait for the page content to appear, and
reload once. Expected sample data and success messages are local/demo-only.

---

## 1. Signup and Login UI

### 1.1 Signup — student role

- **Route:** `/signup?role=student`
- **Action:** Open directly. Confirm Student is selected. Submit with every
  field blank.
- **Expected:** Inline validation identifies name, valid email, password
  requirements, confirmation, and terms. No account is created.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 1.2 Signup — invalid email and password confirmation

- **Route:** `/signup?role=student`
- **Action:** Enter a name, an invalid email (for example `not-an-email`), a
  password that meets the displayed requirements, a different confirmation,
  and accept the terms. Submit.
- **Expected:** Invalid email and mismatched-password errors are visible;
  signup does not complete.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 1.3 Signup — local validation success

- **Route:** `/signup?role=student`
- **Action:** Use synthetic test-only values, a syntactically valid email, a
  password satisfying the displayed rules, the same confirmation, and accept
  the terms. Submit.
- **Expected:** Local validation notice says “Your details pass local
  validation. No account was created.” Remain on signup; do not expect an
  account or authenticated session.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 1.4 Signup — mentor role selection

- **Route:** `/signup?role=mentor`
- **Action:** Open directly. Verify Mentor is selected; switch between
  Student and Mentor and inspect the submit button label. Do not enter a real
  password.
- **Expected:** The selected role and button label update. There is one shared
  validation form; role selection does not create an account or open a
  role-specific dashboard.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 1.5 Signup/Login navigation

- **Route:** `/signup`
- **Action:** Click the header or footer “Log in” link. On Login, click the
  logo/home link.
- **Expected:** Login route is `/login`; logo returns to `/`. Login is an
  intentional authentication placeholder with no login inputs or simulated
  credentials.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 1.6 Login placeholder direct route and refresh

- **Route:** `/login`
- **Action:** Open directly and refresh.
- **Expected:** “Login” and “Authentication is not connected” explanatory
  placeholder render; no sign-in form or credential behavior is present.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

---

## 2. Dashboard and Sidebar Navigation

### 2.1 Dashboard direct load and refresh

- **Route:** `/dashboard`
- **Action:** Open directly; refresh; inspect page heading, navigation, and
  any dashboard sections.
- **Expected:** Demo dashboard renders inside the shared shell. Its title may
  appear in the shell top bar rather than as a main-content H1. Treat sample
  dashboard content as illustrative.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 2.2 Sidebar destination and active state

- **Route:** `/dashboard`
- **Action:** Click each visible sidebar link: Dashboard, Hackathons, AI Team
  Matcher, Skill Swap, Mentors, Teams, Assignments, Battle Arena, AI Mentor,
  Profile, and Settings. On each destination, inspect which sidebar item is
  active.
- **Expected:** Each item opens its corresponding route and active styling
  follows the current section. Use the mobile navigation control on a narrow
  screen rather than clicking hidden desktop navigation.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 2.3 Logo, browser history, and shell controls

- **Route:** `/dashboard`
- **Action:** Click DEV BYTE logo, return to dashboard, navigate to a feature,
  then use browser Back and Forward. Inspect search, notifications, profile
  menu, and mobile drawer controls if shown.
- **Expected:** Logo returns home; Back/Forward restore visited routes.
  Dashboard search/menu controls should show a visible response or their
  documented empty/demo state. Record any control with no visible effect.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

---

## 3. Hackathons and Details

### 3.1 Hackathon listing controls

- **Route:** `/discover/hackathons`
- **Action:** Try search, category/mode/status filters, sort options, clear or
  reset controls, and a query that returns no items.
- **Expected:** List/count updates to selections; reset restores examples;
  no-results state offers a recovery path.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 3.2 Hackathon detail and return navigation

- **Route:** `/discover/hackathons/interface-sprint` (or open a card from the
  listing)
- **Action:** Open a listing card, inspect detail sections and action buttons,
  then click the return/all-hackathons link.
- **Expected:** Matching sample detail appears and return link opens
  `/discover/hackathons`. Participation/registration content is
  informational/demo-only.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 3.3 Unknown hackathon ID

- **Route:** `/discover/hackathons/not-a-real-id`
- **Action:** Open directly and refresh.
- **Expected:** Feature-level unavailable/not-found state with a sensible
  return to hackathon discovery; not a blank page or broken render.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

---

## 4. Teams, Team Creation, and Team Matcher

### 4.1 Team listing, filters, and detail

- **Route:** `/build/teams`
- **Action:** Try team search and available status/interest/skill/
  collaboration filters; open a team card and return to the list.
- **Expected:** Sample results respond to controls; detail matches the
  selected sample team; return navigation goes to `/build/teams`.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 4.2 Team creation — empty validation

- **Route:** `/build/teams/new`
- **Action:** Submit **Create local preview** with all fields blank.
- **Expected:** Custom validation messages for team name (at least 3
  characters), project title (at least 3), description (at least 30), at
  least one skill/technology, at least one desired role/skill, and a
  collaboration preference. These validations are custom; native `required`
  indicators may not be present.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 4.3 Team creation — valid local preview and repeat submission

- **Route:** `/build/teams/new`
- **Action:** Enter:
  - Team name: `Prototype Club`
  - Project title: `Accessible study planner`
  - Project description: `A lightweight planner that helps students break study goals into accessible weekly tasks.`
  - Skills: `React, TypeScript`
  - Desired roles: `Frontend developer, UX research`
  - Collaboration: `Remote · async-friendly`
  Submit; inspect preview; submit again without leaving the page.
- **Expected:** Temporary preview displays the entered information and says
  nothing was saved or sent. Repeat submit remains usable and does not create
  persistent data.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 4.4 Team detail and join preview

- **Route:** `/build/teams/prototype-garden`
- **Action:** Open a forming team; follow its join/introduction preview. Try
  empty and then valid local form values if available.
- **Expected:** Team detail corresponds to the sample card; validation and
  local preview appear; explicit copy says the introduction is not sent or
  saved. Return-to-details link works.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 4.5 Unknown team ID

- **Route:** `/build/teams/not-a-real-id`
- **Action:** Open directly and refresh.
- **Expected:** Clear team-unavailable state with a route back to team
  discovery.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 4.6 AI Team Matcher preferences and result preview

- **Route:** `/discover/team-matcher`
- **Action:** Select React and TypeScript under skills to contribute; Python
  under skills to learn; Learning tools domain; Frontend developer role;
  Remote async collaboration; choose Early experience and Weekends. Click
  **Explore sample profiles**, then **Edit preferences**.
- **Expected:** Selected buttons visibly indicate selection; progress reaches
  2/2; results show three fixed fictional profiles and a summary reflecting
  chosen preferences; disclosure says no AI model ran. Edit returns to form
  while retaining choices.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

---

## 5. Skill Swap

### 5.1 Skill Swap listing and filters

- **Route:** `/discover/skill-swap`
- **Action:** Search for a skill, change category/proficiency and teach/learn
  direction controls, trigger an empty result, then reset.
- **Expected:** Cards/count respond; empty state and reset work; results are
  sample content.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 5.2 Skill Swap detail and request preview

- **Route:** `/discover/skill-swap/react-python`
- **Action:** Open a listing detail, inspect its return action, then choose
  the request preview. Try invalid and valid request input.
- **Expected:** Detail and request preview correspond to the chosen sample;
  local validation/result is visible; disclosure states that no request or
  message was sent. Return to details/list works.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 5.3 Unknown Skill Swap ID

- **Route:** `/discover/skill-swap/not-a-real-id`
- **Action:** Open directly and refresh.
- **Expected:** Clear unavailable state and a working link back to listing.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

---

## 6. Coding Arena

### 6.1 Battle Arena listing

- **Route:** `/practice/battle-arena`
- **Action:** Search challenges; change topic/difficulty filters and sorting;
  test empty results and reset; open a challenge.
- **Expected:** Local sample list updates; empty/reset behavior is visible;
  selected challenge opens its workspace.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 6.2 Challenge workspace controls

- **Route:** `/practice/battle-arena/pair-sum`
- **Action:** Change Description/Examples/Submissions tabs with mouse and
  keyboard; change language; edit starter text; test copy, run, and submit
  preview controls.
- **Expected:** Tabs/panel and language respond; copy reports success or
  failure; Run/Submit displays an honest local preview and does not execute
  or submit code. “All challenges” returns to listing.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 6.3 Unknown challenge ID

- **Route:** `/practice/battle-arena/not-a-real-id`
- **Action:** Open directly and refresh.
- **Expected:** Clear unavailable state and a return to challenge catalogue.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

---

## 7. Assignments

### 7.1 Assignment listing

- **Route:** `/practice/assignments`
- **Action:** Try title/topic search, status filter, sorting, empty result,
  reset, and open a listed assignment.
- **Expected:** Local list responds and assignment detail matches the selected
  card.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 7.2 Assignment detail and local submission preview

- **Route:** `/practice/assignments/accessible-profile-card`
- **Action:** Submit with fields blank to inspect validation. Then enter a
  valid written response or project URL and use the preview action. Return to
  all assignments.
- **Expected:** Validation explains missing/invalid content. Valid input
  displays a local draft/preview and states nothing was submitted or saved.
  Return link opens assignments listing.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 7.3 Unknown assignment ID

- **Route:** `/practice/assignments/not-a-real-id`
- **Action:** Open directly and refresh.
- **Expected:** Assignment-unavailable state and a return link.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

---

## 8. Mentors and Booking Preview

### 8.1 Mentor discovery controls

- **Route:** `/discover/mentors`
- **Action:** Search by name/skill, change expertise/experience/availability
  filters and sort, trigger no results, reset, and open a mentor.
- **Expected:** Fictional/sample listings update; empty/reset states work;
  profile matches selected card; rating/review content remains labeled as
  sample.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 8.2 Mentor profile and unknown profile

- **Route:** `/discover/mentors/maya-chen`
- **Action:** Inspect profile, related profiles and availability, click
  **Book a session**, then return to profile. Also open
  `/discover/mentors/not-a-real-id`.
- **Expected:** Profile and return links work; unknown ID shows an unavailable
  state. Profile people and availability are fictional/demo-only.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 8.3 Booking form, review, edit, and local confirmation

- **Route:** `/discover/mentors/maya-chen/book`
- **Action:** Attempt review with missing choices; then select session format,
  date, time and enter a valid mentorship goal. Review, edit selections, and
  show confirmation.
- **Expected:** Missing values show validation; summary reflects choices;
  edit returns to form; local confirmation explicitly says no session was
  booked, sent, or saved. Profile return works.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

---

## 9. AI Mentor

### 9.1 Chat suggestions, send, clear, and keyboard

- **Route:** `/grow/ai-mentor`
- **Action:** Choose a suggested prompt, send a custom prompt, try Enter and
  Shift+Enter, then clear the conversation.
- **Expected:** User prompt and fixed illustrative response appear; loading/
  typing state, if shown, ends; clear returns to empty state. Visible
  disclosure says no AI service is connected and replies are samples.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

---

## 10. Profile, History, Saved Items, and Other Registered Pages

### 10.1 Profile placeholder

- **Route:** `/profile`
- **Action:** Open from sidebar and directly; refresh.
- **Expected:** Intentional placeholder says profile settings are not
  connected. Do not expect editable account data.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 10.2 Settings placeholder

- **Route:** `/settings`
- **Action:** Open from sidebar and directly; refresh.
- **Expected:** Intentional settings placeholder appears; do not expect
  account controls.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 10.3 History and Saved items routes

- **Route:** No `/history` or `/saved` route is registered in `src/App.tsx`.
- **Action:** Do not treat these as expected product pages. Optionally enter
  `/history` or `/saved` directly to confirm not-found handling.
- **Expected:** The application not-found page appears. There is no registered
  History or Saved items feature to test.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 10.4 Unknown route

- **Route:** `/not-a-route`
- **Action:** Open directly, refresh, then use any visible recovery links.
- **Expected:** “Page not found” fallback appears, not a blank screen. Home
  navigation works; Login link opens its documented placeholder.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

### 10.5 Student and Mentor dashboard availability

- **Route:** `/dashboard` and `/signup?role=student` /
  `/signup?role=mentor`
- **Action:** Compare role choices on signup; inspect dashboard and account
  placeholders.
- **Expected:** Signup role choice changes form selection/copy only. The
  current frontend has one demo dashboard and no distinct authenticated
  Student or Mentor account views.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations:** ________________________________________________

---

## 11. Responsive Layout

For each width below, resize the browser viewport (DevTools device toolbar is
acceptable), reload the route, and inspect page edges, content, controls, and
navigation. Use the controls with mouse/keyboard where possible. Look for
horizontal scrolling, clipped text/cards, overlapping UI, hidden controls
without an alternative, and touch targets too small to use comfortably.

### 11.1 Mobile — 390px

- **Viewport:** 390px wide
- **Routes to inspect:** `/`, `/signup`, `/login`, `/dashboard`,
  `/discover/hackathons`, `/discover/hackathons/interface-sprint`,
  `/build/teams`, `/build/teams/new`, `/build/teams/prototype-garden`,
  `/build/teams/prototype-garden/join`, `/discover/team-matcher`,
  `/discover/skill-swap`, `/discover/skill-swap/react-python`,
  `/discover/skill-swap/react-python/request`, `/practice/battle-arena`,
  `/practice/battle-arena/pair-sum`, `/practice/assignments`,
  `/practice/assignments/accessible-profile-card`, `/discover/mentors`,
  `/discover/mentors/maya-chen`, `/discover/mentors/maya-chen/book`,
  `/grow/ai-mentor`, `/profile`, `/settings`, `/not-a-route`.
- **Action:** Visit each route; check horizontal scroll, clipped UI, sidebar/
  mobile menu, cards, forms, workspace/editor, booking summary, chat composer,
  headings, and controls.
- **Expected:** Content fits the viewport without unintended horizontal
  overflow; navigation and controls remain visible and usable; no overlap or
  clipping.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations (list any failing URLs):** ____________________________

### 11.2 Tablet — 768px

- **Viewport:** 768px wide
- **Routes to inspect:** Same full route list as test 11.1.
- **Action:** Repeat the layout and interaction checks at this width, paying
  attention to navigation breakpoint transitions, two-column forms/cards,
  tables/editor, and side panels.
- **Expected:** No accidental overflow, clipped text, overlapping controls,
  or inaccessible navigation.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations (list any failing URLs):** ____________________________

### 11.3 Laptop/tablet — 1024px

- **Viewport:** 1024px wide
- **Routes to inspect:** Same full route list as test 11.1.
- **Action:** Repeat layout checks, including desktop/sidebar transition,
  detail-page columns, forms, filter panels, coding workspace, booking
  summary, and chat.
- **Expected:** Page fits without unintended horizontal scrolling or content
  overlap; controls remain operable.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations (list any failing URLs):** ____________________________

### 11.4 Desktop — 1440px

- **Viewport:** 1440px wide
- **Routes to inspect:** Same full route list as test 11.1.
- **Action:** Repeat layout checks, including navigation/sidebar, maximum
  content width, wide grids, forms, editor/workspace, and cards.
- **Expected:** Content is aligned and readable; no unintended overflow,
  stretching, or overlapping.
- **Status:** [ ] NOT TESTED [ ] PASS [ ] FAIL [ ] NOT APPLICABLE
- **My observations (list any failing URLs):** ____________________________

## Final notes (fill in after your manual session)

- Routes completed: ____________________________________________________
- Issues reproduced (route + exact action): _____________________________
- Console/page errors observed: ________________________________________
- Routes/interactions still untested: ___________________________________
- Date tested: __________________  Browser/OS: _________________________

