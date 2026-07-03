# 🧪 QA Automation Portfolio

[![Playwright Tests](../../actions/workflows/playwright.yml/badge.svg)](../../actions/workflows/playwright.yml)

Hands-on portfolio of a QA engineer expanding from manual testing (API &
database) into **test automation** and **performance testing**. Every test in
this repo runs against public practice targets and executes on CI.

## What's inside

| Area | Tool | Status |
| ---- | ---- | ------ |
| API testing | Playwright (`request`) | ✅ Auth + full CRUD against [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) |
| UI testing | Playwright (TypeScript) | ✅ Login scenarios + E2E checkout against [SauceDemo](https://www.saucedemo.com) |
| Performance | k6 | 🚧 Smoke test with thresholds — load/stress/spike scenarios planned |
| Performance | JMeter | 📋 Planned |
| CI/CD | GitHub Actions | ✅ Full suite on every push, HTML report as artifact |

## Project structure

```
├── tests/
│   ├── api/           # Playwright API tests (Restful Booker)
│   └── ui/            # Playwright UI tests (SauceDemo)
├── performance/
│   ├── k6/            # k6 scripts (JavaScript)
│   └── jmeter/        # JMeter test plans
├── docs/
│   └── learning-roadmap.md
└── .github/workflows/ # CI pipeline
```

## Getting started

```bash
npm ci
npx playwright install chromium
npm test              # run everything
npm run test:api      # API tests only
npm run test:ui       # UI tests only
npm run report        # open the HTML report
```

## Skills demonstrated

- REST API test design: auth flows, request chaining, CRUD verification,
  asserting on real-world API quirks (non-standard status codes)
- UI automation: role-based locators, auto-waiting assertions, E2E user flows
- Performance testing concepts: smoke tests, latency percentiles (p95),
  error-rate thresholds
- CI/CD: automated test runs with report artifacts on GitHub Actions

## Roadmap

See [docs/learning-roadmap.md](docs/learning-roadmap.md) for the full learning
plan — next up: Page Object Model, k6 load profiles, JMeter dashboards, and
AI-assisted test generation with Playwright Agents.
