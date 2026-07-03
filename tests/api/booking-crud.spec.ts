import { test, expect } from '@playwright/test';

// Full CRUD flow against /booking.
// Demonstrates: request chaining, auth token reuse, response body assertions.

const bookingPayload = {
  firstname: 'Bosco',
  lastname: 'Nguyen',
  totalprice: 250,
  depositpaid: true,
  bookingdates: { checkin: '2026-08-01', checkout: '2026-08-05' },
  additionalneeds: 'Breakfast',
};

test.describe.serial('Booking CRUD', () => {
  let bookingId: number;
  let token: string;

  test.beforeAll(async ({ request }) => {
    const auth = await request.post('/auth', {
      data: { username: 'admin', password: 'password123' },
    });
    token = (await auth.json()).token;
  });

  test('POST /booking creates a booking', async ({ request }) => {
    const response = await request.post('/booking', { data: bookingPayload });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.booking).toMatchObject(bookingPayload);
    bookingId = body.bookingid;
  });

  test('GET /booking/:id returns the created booking', async ({ request }) => {
    const response = await request.get(`/booking/${bookingId}`);
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(bookingPayload);
  });

  test('PATCH /booking/:id updates the booking (requires auth)', async ({ request }) => {
    const response = await request.patch(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
      data: { totalprice: 300 },
    });
    expect(response.status()).toBe(200);
    expect((await response.json()).totalprice).toBe(300);
  });

  test('DELETE /booking/:id removes the booking', async ({ request }) => {
    const response = await request.delete(`/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    // API quirk: returns 201 instead of the conventional 204.
    expect(response.status()).toBe(201);

    const verify = await request.get(`/booking/${bookingId}`);
    expect(verify.status()).toBe(404);
  });
});
