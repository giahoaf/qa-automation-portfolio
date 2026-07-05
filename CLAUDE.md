# QA Automation Portfolio

Learning-focused QA portfolio: Playwright API/UI testing plus an AI agent
workflow (planner / generator / healer). The owner is a QA engineer learning
automation — explain decisions, don't just execute.

## Commands

- `npm test` — full suite (API + UI)
- `npm run test:api` / `npm run test:ui` — one project only
- `npx playwright test <file> --project=ui-chromium` — single file
- `npm run report` — open the HTML report

## Structure

- `tests/api/` — API tests (Restful Booker)
- `tests/ui/` — UI tests (SauceDemo); `tests/ui/generated/` holds tests
  produced by the generator agent, one scenario per file
- `specs/` — test plans written by the planner agent; generated tests
  reference their plan via a `// spec:` header comment
- `performance/` — k6 (JMeter planned)
- `docs/` — LOCAL ONLY (gitignored personal notes). Never commit it.

## Test conventions (enforced through code review)

- One test = one behavior. Don't verify unrelated page content in passing.
- Never assert what Playwright already guarantees — no `toHaveValue`
  right after `fill`.
- No brittle exact counts unless the count IS the behavior under test.
- Prefer `data-test` attributes or `getByRole`; avoid loose `getByText`.
- Keep the `// spec:` / `// seed:` header comments in generated tests.
- A test that pins quirky observed behavior (characterization test) must
  say so in a comment.

## Working style

- The owner is learning: state the plan and get confirmation before any
  state-changing action; let them run commit/push themselves.
- Land working code first, refine in a follow-up commit.
