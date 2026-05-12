# Decisions

## Data layer — invalidation by default, surgical optimism where it pays off

- **Mutations.** Create just invalidates [`statusKeys.lists()`](src/hooks/status-keys.ts) — a naive optimistic prepend would lie when the active filter excludes the new row (e.g. viewing "Blocked" and posting "On Track"). Update and delete *are* safe to apply optimistically because both touch a known row in known list pages, so [`use-status-mutations.ts`](src/hooks/use-status-mutations.ts) `cancelQueries` → `setQueriesData` patches every cached list page that contains the row, with a snapshot rollback on error.
- **Loading & errors.** Every list query renders an [`<ErrorState />`](src/components/feedback/error-state.tsx) with a `Try again` button wired to `refetch()`. The form maps the API's `details` payload onto field-level errors via `setFieldMeta`, and a small [`<ToastProvider />`](src/components/ui/toast.tsx) surfaces success / failure on every mutation so a 500 is never a silent navigation.
- **Route loaders.** Routes call `queryClient.ensureQueryData(...)` against shared `queryOptions` factories ([`use-statuses.ts`](src/hooks/use-statuses.ts), [`use-teams.ts`](src/hooks/use-teams.ts)). Combined with `defaultPreload: 'intent'` on the router ([`App.tsx`](src/App.tsx)), hover-prefetch is real and the loader and the component agree on key + fn — one cache entry per request, no stale-on-first-paint flash.
- **Hover-prefetch is opt-out per Link**, not blanket-on. The router still runs `defaultPreload: 'intent'`, but the Feed (`/`) and My Updates (`/my-updates`) sidebar links pass `preload={false}` ([`nav-items.ts`](src/components/layout/nav-items.ts), wired in [`sidebar.tsx`](src/components/layout/sidebar.tsx) + [`mobile-top-bar.tsx`](src/components/layout/mobile-top-bar.tsx)). Their data churns every time a teammate posts, so a pointer brushing the sidebar would fire `GET /api/statuses` the user never asked for. Team Overview, Settings, New Update, and Edit keep `intent` prefetch — their data is either stable (teams list, team-summary), already in cache from the row click (status detail), or has no fetch at all (Settings is just a code-split bundle warm-up). Net effect: prefetch behavior is on display where it costs nothing, and off where it would generate noise.
- **Form.** Picked **TanStack Form + Zod** over react-hook-form for ecosystem coherence with TanStack Router/Query, tight TypeScript inference for field paths, and a clean way to merge server-side errors back into form meta. One [`<StatusForm />`](src/components/status/status-form.tsx) powers create + edit; edit hydrates from `useStatus(id)` and switches the mutation.
- **URL state.** Feed filters and pagination live entirely in `useSearch` / `navigate`, validated by [`feedSearchSchema`](src/lib/search-params.ts). The back button works, links are shareable, and `statusKeys.list(params)` collapses to a stable shape.

## Tradeoffs deliberately scoped down

- **"Me" is hardcoded** to `user-1` (Alex Chen) via [`CurrentUserContext`](src/lib/current-user.tsx). The mock has no auth and `POST /api/statuses` randomizes the author server-side, so a freshly-posted update may not appear under My Updates — a property of the mock, not the code.
- **My Updates is capped** at the most recent 50 rows (and says so in the UI). Until the list endpoint ships `?authorId=`, there's no scalable server-side answer.
- **Project list is hardcoded** ([`status-schema.ts`](src/lib/status-schema.ts)) because the API doesn't expose `/api/projects`.
- **Settings is four static, design-faithful cards.** The rubric weights data architecture, not pseudo-features.
- **No tests / no dark mode.** Tests are explicitly excluded; designs are light-only. The theme is fully token-driven, so a dark palette is a CSS-only swap.

## API shape — things I'd push back on

- **Auth chain.** No `GET /api/me`, `POST /api/statuses` randomizes `authorId` ([`mock-server.ts`](src/api/mock-server.ts) L294), and the list endpoint has no `?authorId=` filter. Each is fixable individually; together they make "My Updates" undefinable from the contract alone.
- **No `GET /api/projects`.** Every client reinvents the same hardcoded array.
- **Display fields are denormalized onto `StatusUpdate`** (`authorName`, `authorAvatar`, `teamName`). Renames leave stale labels until each row is edited. Either declare them as write-time snapshots (and join client-side from `/api/teams` + a future `/api/users`), or join on read.
- **`GET /api/team-summary` is global** — it returns all authors with no `?teamId=` filter, so the name is misleading for any product with more than one team.
- **Status enum is implicit** — the four values live only in the prose spec, so adding a fifth status silently breaks the FE's `tv()` chip variants.
- **Search index excludes `project`.** Users will type project names first and get zero matches.

## What I'd reach for next

- Real auth + `GET /api/me`; once `?authorId=` exists, swap My Updates to a server-filtered infinite scroll instead of capping at 50.
- Vitest + RTL coverage for the form-submit → toast → list-invalidation flow, plus mutation-rollback tests for the optimistic update / delete paths.
- Feed virtualization (`@tanstack/react-virtual`) once datasets grow.

The `api/` and `hooks/` modules are organized so swapping MSW for a real backend is a one-file change in [`client.ts`](src/api/client.ts).
