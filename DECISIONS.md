# Decisions

## Architecture decision

I picked TanStack Form + Zod over react-hook-form because it composes naturally with TanStack Router and Query and gives the form a clean way to merge server-side errors back in. The same status form powers both create and edit. URL state follows the same idea: the feed's filters and pagination live entirely in the URL, validated by a Zod schema, so the back button works and links are shareable.

## Data layer: invalidation by default, optimism where it pays off

The mock has 200–600ms latency and a ~5% 500-rate, so the cache is the source of truth. Create just invalidates the lists — a naive optimistic prepend would lie when the active filter excludes the new row (viewing "Blocked", posting "On Track"). Update and delete touch a known row in known pages, so I patch the cache in place and roll back from a snapshot on error. Failures stay visible: every list query renders an error card with a "Try again" button, the form maps server-side validation errors back onto the right fields, and a toast surfaces success or failure on every mutation, so a 500 is never a silent navigation.

Routes warm the cache through `ensureQueryData`, paired with `defaultPreload: 'intent'`. Feed and My Updates opt out of hover-prefetch — they share the same status-list query and it churns whenever a teammate posts — but the rest stay on; hover the Team link from any other page and `GET /api/team-summary` fires before the click.

## Tradeoffs deliberately scoped down

The mock has no auth concept, so "me" is hardcoded to user-1 (Alex Chen) via a small context — exactly the seam where real auth would slot in. My Updates filters the paginated list client-side by author, capped at the most recent 50 rows (the screen says so in the UI). There's a mock quirk where `POST /api/statuses` randomizes the author server-side, so a freshly-posted update may not appear under My Updates — that's a property of the mock, not the code. The project list is also hardcoded since the API doesn't expose `/api/projects`. Settings is four static, design-faithful cards because the rubric weights data architecture, not pseudo-features. I skipped tests (the rubric excludes them) and dark mode (designs are light-only), but the theme is fully token-driven, so a dark palette is a CSS-only swap.

## API shape — things I'd push back on

The biggest one is the auth chain. There's no `GET /api/me`, the create endpoint randomizes the author server-side, and the list has no author filter. Each is fixable individually; together they make "My Updates" undefinable from the contract alone — in production the author has to come from auth context on write and the list has to support filtering by it on read.

A few other shapes are awkward enough to flag:

- No `GET /api/projects` — every client reinvents the same hardcoded array.
- Display fields like author name, avatar, and team name are denormalized onto every status row, so a rename leaves stale labels everywhere until each row is touched.
- `GET /api/team-summary` returns all authors with no team filter, so it's a global activity summary rather than a per-team view.
- The status enum lives only in the prose spec — no discovery endpoint, so adding a fifth status silently breaks chip styling.
- Search covers body and author name but not project. Users will type project names first and get zero matches.


## What I'd reach for next

Real auth and a proper "me" endpoint; an author filter on the list so My Updates can stop capping at 50; some Vitest + RTL coverage for the form-submit → toast → invalidation flow and the optimistic rollback paths; and feed virtualization once datasets grow. The `api/` and `hooks/` modules are organized so swapping MSW for a real backend is essentially a one-file change.
