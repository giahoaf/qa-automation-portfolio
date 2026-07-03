import { test, expect } from '@playwright/test';

// Restful Booker is a public API built for practising API testing:
// https://restful-booker.herokuapp.com/apidoc/index.html

test.describe('Auth API', () => {
  test('POST /auth returns a token for valid credentials', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'admin', password: 'password123' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
  });

  test('POST /auth rejects invalid credentials', async ({ request }) => {
    const response = await request.post('/auth', {
      data: { username: 'admin', password: 'wrong-password' },
    });

    // API quirk: returns 200 with an error body instead of 401 —
    // a real-world behaviour worth pinning down with an assertion.
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.reason).toBe('Bad credentials');
  });
});
