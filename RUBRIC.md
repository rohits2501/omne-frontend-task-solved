# Pulse Assessment — Evaluation Rubric

This rubric is public. We believe in transparency about how we evaluate candidates.

---

## Scoring Overview

Each dimension is scored on a 1–4 scale:

| Score | Meaning |
|---|---|
| 1 | Significant gaps — would need heavy mentoring in this area |
| 2 | Acceptable — gets the job done but misses common best practices |
| 3 | Strong — demonstrates solid professional habits and good judgment |
| 4 | Exceptional — shows craft, foresight, and attention that goes beyond the ask |

**Hiring threshold:** Average of 3.0+ across all dimensions, with no dimension below 2.

---

## Dimension 1: Component Architecture (Weight: 30%)

How well did the candidate decompose the Figma output into clean, reusable components?

**Score 4 — Exceptional:**
- Clear, intuitive component boundaries with single responsibilities
- Thoughtful prop interfaces — not too broad, not too narrow
- Shared components are genuinely reusable (e.g., a StatusChip that works in both the feed and the table)
- Smart use of composition patterns (children, render props, or slots where appropriate)
- Component names clearly communicate purpose without needing to read the code

**Score 3 — Strong:**
- Reasonable decomposition — obvious shared elements are extracted
- Props are typed and make sense
- File/folder organization is logical and consistent
- Minor opportunities for further extraction but nothing egregious

**Score 2 — Acceptable:**
- Some decomposition but large monolithic components remain
- Prop interfaces are loose (lots of optional props, unclear contracts)
- File organization is flat or inconsistent
- Components are tightly coupled to specific screens when they don't need to be

**Score 1 — Significant Gaps:**
- Little to no refactoring of the Figma output
- Components are just renamed copies of the generated files
- No shared components extracted
- Props are untyped or use `any` throughout

---

## Dimension 2: Data Layer & API Integration (Weight: 30%)

How well did the candidate integrate TanStack Query and handle server state?

**Score 4 — Exceptional:**
- Query keys are well-structured and consistent (e.g., factory pattern or clear conventions)
- Custom hooks abstract query logic cleanly (e.g., `useStatuses`, `useCreateStatus`)
- Mutations include thoughtful cache updates (optimistic or invalidation with clear rationale)
- Filters and pagination are driven by URL state via TanStack Router
- Error boundaries or error handling is user-facing and graceful

**Score 3 — Strong:**
- TanStack Query is used correctly for all data fetching
- Mutations exist and trigger cache invalidation
- Loading and error states are handled with visible UI
- Pagination works and filters update the query

**Score 2 — Acceptable:**
- TanStack Query is used but with issues (e.g., queries inside event handlers, missing keys)
- Some loading states handled, errors mostly ignored
- Cache is not invalidated after mutations (stale data shown)
- Filters work but aren't reflected in the URL

**Score 1 — Significant Gaps:**
- Data fetching done with raw `fetch` or `useEffect` + `useState`
- No loading or error handling
- No understanding of cache management
- API integration is incomplete or broken

---

## Dimension 3: Styling & UI Craft (Weight: 20%)

How fluent is the candidate with Tailwind, and how close is the result to the designs?

**Score 4 — Exceptional:**
- Tailwind usage is idiomatic — good use of responsive prefixes, hover/focus states, spacing scale
- The result is visually close to the designs and looks intentional
- Responsive behavior is smooth and well-considered
- Empty states, loading skeletons, and error UI are visually polished
- No leftover Figma-generated styles or unnecessary custom CSS

**Score 3 — Strong:**
- Tailwind is used consistently throughout
- The app is visually reasonable and matches the general feel of the designs
- Basic responsive behavior works (sidebar collapses or stacks)
- Minor visual rough edges but nothing jarring

**Score 2 — Acceptable:**
- Mix of Tailwind and inline styles or leftover Figma classes
- Layout mostly works but breaks at some viewport sizes
- Visual fidelity to designs is loose — things are misaligned or inconsistently spaced
- Some generated CSS/styles remain uncleaned

**Score 1 — Significant Gaps:**
- Figma-generated styles largely untouched
- Layout is broken or only works at one viewport size
- No evidence of Tailwind fluency
- UI looks unfinished

---

## Dimension 4: Code Quality & TypeScript (Weight: 10%)

General code hygiene, TypeScript usage, and attention to detail.

**Score 4 — Exceptional:**
- TypeScript is used meaningfully — domain types are defined, generics where appropriate
- No `any` types (or very rare, justified cases)
- Code passes lint/format without issues
- Consistent patterns across the codebase (naming, exports, file structure)
- Small touches that show care (meaningful variable names, clear function signatures)

**Score 3 — Strong:**
- TypeScript types exist for API responses and component props
- Few or no `any` types
- Code is clean and readable
- Lint/format mostly passing

**Score 2 — Acceptable:**
- Some TypeScript but with gaps (untyped props, `any` in places)
- Code is readable but inconsistent in style
- Some lint issues

**Score 1 — Significant Gaps:**
- TypeScript is effectively `any`-typed throughout
- Code style is inconsistent
- Lint/format config is ignored

---

## Dimension 5: Communication & Judgment (Weight: 10%)

The DECISIONS.md document and overall approach to the problem.

**Score 4 — Exceptional:**
- DECISIONS.md is clear, concise, and shows strong reasoning
- Tradeoffs are explicitly named (not just "I chose X" but "I chose X over Y because...")
- Demonstrates awareness of what they'd improve with more time
- Shows understanding of the broader system context (e.g., "In a real app, I'd also consider...")

**Score 3 — Strong:**
- DECISIONS.md covers meaningful decisions with reasonable explanations
- Shows self-awareness about tradeoffs and limitations
- Writing is clear and professional

**Score 2 — Acceptable:**
- DECISIONS.md exists but is thin or surface-level
- Decisions described but not well-justified
- Missing discussion of tradeoffs

**Score 1 — Significant Gaps:**
- DECISIONS.md is missing or a single sentence
- No evidence of deliberate decision-making
- Unable to articulate reasoning

---

## Follow-Up Conversation

After reviewing the submission, we'll schedule a 30–45 minute conversation. This is not a grilling session — it's a collaborative discussion. Expect questions like:

- "Walk me through how you decided where to draw component boundaries."
- "If the API returned 10x more data, what would you change about your Query setup?"
- "You mentioned [X] in your DECISIONS.md — can you expand on that?"
- "If a designer asked you to change the status chip colors, how would you approach that in this codebase?"
- "What would you do differently if you had another 4 hours?"

The conversation is weighted equally to the code submission. We're looking for clear thinking, honesty about what you know and don't know, and collaborative communication.
