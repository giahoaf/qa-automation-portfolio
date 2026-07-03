import http from 'k6/http';
import { check, sleep } from 'k6';

// Smoke test: minimal load to prove the script and the target both work.
// Target is QuickPizza, a demo app Grafana provides for k6 practice.
//
// Run:  k6 run performance/k6/smoke-api.js
//
// IMPORTANT: only point k6 at systems you own or have permission to load.
// Keep public demo targets at smoke level (a few VUs) — for real load
// profiles, run the target app locally first.

export const options = {
  vus: 3,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<800'], // 95% of requests under 800ms
    http_req_failed: ['rate<0.01'], // less than 1% errors
  },
};

const BASE_URL = 'https://quickpizza.grafana.com';

export default function () {
  const res = http.get(BASE_URL);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body mentions pizza': (r) => r.body.includes('pizza'),
  });
  sleep(1);
}
