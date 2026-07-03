# k6 Performance Tests

Load testing scripts written in JavaScript using [k6](https://k6.io).

## Setup

```powershell
winget install k6.k6
```

## Run

```powershell
k6 run performance/k6/smoke-api.js
```

## Scripts

| Script | Type | Description |
| ------ | ---- | ----------- |
| `smoke-api.js` | Smoke | 3 VUs / 30s sanity check with p95 latency and error-rate thresholds |

## Planned scenarios

- [ ] Load test with ramping stages (`ramping-vus` executor)
- [ ] Stress test to find the breaking point
- [ ] Spike test simulating sudden traffic bursts
- [ ] Soak test for memory-leak detection (30+ minutes)

> ⚠️ Only run load tests against systems you own or have explicit permission
> to test. Public demo sites are for smoke-level practice only.
