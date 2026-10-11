# DEV BYTE Phase 5 — Battle Arena & Assignments

## Features implemented

### Battle Arena

- `/practice/battle-arena` now contains a searchable sample challenge catalogue with difficulty and topic filters, estimated-time/title/difficulty sorting, filter reset, and an empty state.
- Challenge cards expose sample title, difficulty, topic tags, and illustrative time estimates.
- `/practice/battle-arena/:challengeId` provides a challenge workspace with a problem brief, constraints, input/output examples, language selector, editable starter snippets, and Description / Examples / Submissions tabs.
- Tab navigation supports Arrow Left/Right and Home/End, and tab panels use associated ARIA IDs.
- Copy starter-code action reports success or clipboard-access failure to the user.
- Run and submit controls display explicit frontend-only previews. They do not run code or create submissions. The workspace notes that it is a lightweight editor-style textarea without syntax highlighting or execution.
- Unknown challenge IDs show a not-found state.

### Assignments

- `/practice/assignments` now contains a sample assignment overview with title/topic search, status filters, due-date/title/progress sorting, sample upcoming/completed summaries, illustrative progress bars, and an empty state.
- `/practice/assignments/:assignmentId` provides sample instructions, requirements, due/status/priority details, and a response/project URL preview form.
- Client-side validation requires a written response or URL, enforces a minimum response length, and validates project URLs as HTTP(S).
- A valid draft displays an explicit preview message; nothing is submitted or stored. No external resource links are shown because the sample assignments have no valid destinations.
- Unknown assignment IDs show a not-found state.

## Files created

- `src/pages/phase5-demo-data.ts` — typed sample challenge and assignment data.
- `src/pages/BattleArenaPage.tsx`
- `src/pages/AssignmentsPage.tsx`
- `src/practice.css`
- `docs/PHASE_5_ARENA_ASSIGNMENTS_REPORT.md`

## Files modified

- `src/App.tsx` — registers the two listing and two detail route patterns and removes the corresponding placeholders.
- `src/components/dashboard/DashboardLayout.tsx` — supplies detail/workspace titles and normalizes trailing slashes before resolving route titles.
- `src/index.css` — imports the Phase 5 stylesheet.

## Demo-data and backend boundary

All challenge and assignment examples, dates, statuses, progress, and estimates are typed and isolated in `phase5-demo-data.ts`. The interface identifies the catalogue/coursework as sample content. The editor does not execute code; run/submit actions are illustrative only. Assignment preview submissions are temporary local UI state. No APIs, database, authentication, execution service, server submission, or persistence were added.

## Accessibility, animation, and responsive checks

- Reused the existing `motion` dependency and feature UI primitives. Page/card entrances and tab transitions use motion and honor reduced-motion preferences; no continuous animation was introduced.
- Search/select fields have accessible labels; progress bars expose accessible labels and values; tabs expose selected state, panel relationships, and keyboard navigation.
- Focus indicators are visible for interactive controls, and copy/form outcome messages use status feedback.
- Browser checks covered feature layouts at **390px, 768px, and 1440px** across both listing and detail screens; no horizontal overflow was observed.
- Reduced-motion media preference was enabled and detected in the browser.
- Browser back navigation from an assignment detail returned to the assignment list.
- Smoke checks rendered the landing, login, signup, dashboard, Phase 4 listing/detail/workflow screens, and the Phase 5 routes with their main content. The dashboard uses its top bar title rather than an `h1` inside its main landmark.

## Verification results

- `npm exec tsc -- -b --pretty false` — passed after final changes.
- `npm run lint` — passed after final changes.
- `npm run build` — passed; Vite transformed 530 modules and completed the production build.
- Editor diagnostics for `src/` — no errors reported.
- Production build emitted Vite's advisory that the minified JavaScript chunk is above 500 kB. Build completed successfully; code splitting was not introduced as part of this feature change.
- Browser checks passed for challenge search, difficulty/topic filters, sorting, empty state/reset, detail navigation, workspace tabs, keyboard tab navigation, language selection, and honest run/submit previews.
- Browser checks passed for assignment listing, status filtering, sorting, empty state, required-field validation, local submission preview, detail navigation, browser back, and unknown-ID handling.
- Existing Phase 4 routes and the landing, login, signup, and dashboard rendered during regression smoke checks.

## Remaining limitations

- Challenge test cases and assignment progress/status/due dates are illustrative only.
- The coding area is a basic editable text workspace. There is no syntax-highlighting editor, code execution, competition service, account-specific history, or real submission backend.
- Assignment previews are not persisted and do not represent a real submission.
- The application does not yet have an automated browser-test script; browser interaction checks were performed manually through the integrated browser.
