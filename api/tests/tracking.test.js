const request = require('supertest');
const app = require('../src/app');
const { resetDatabase, seedUsers, db } = require('./helpers');

let trackingToken;

beforeAll(async () => {
  await resetDatabase();
  const { client } = await seedUsers();

  const shipment = await db.Shipment.create({
    clientId: client.id,
    referenceCode: 'SH-TEST01',
    trackingToken: 'tracktest0001',
    status: 'in_transit',
    pickupAddress: 'Kigali, Rwanda',
    pickupLat: -1.9577,
    pickupLng: 30.0619,
    dropoffAddress: 'Kampala, Uganda',
    dropoffLat: 0.3476,
    dropoffLng: 32.5825,
    cargoDescription: 'Test cargo',
    currentLat: -0.6072,
    currentLng: 30.6545,
    currentLocationLabel: 'Mbarara, Uganda',
  });

  await db.ShipmentEvent.create({
    shipmentId: shipment.id,
    type: 'status_change',
    status: 'in_transit',
    description: 'In transit',
    lat: -0.6072,
    lng: 30.6545,
  });

  trackingToken = shipment.trackingToken;
});

afterAll(async () => {
  await db.sequelize.close();
});

describe('Public tracking', () => {
  test('returns a shipment by tracking token', async () => {
    const res = await request(app).get(`/api/v1/track/${trackingToken}`);

    expect(res.status).toBe(200);
    expect(res.body.shipment.referenceCode).toBe('SH-TEST01');
    expect(res.body.shipment.events.length).toBeGreaterThanOrEqual(1);
  });

  test('does not leak client identity on the public endpoint', async () => {
    const res = await request(app).get(`/api/v1/track/${trackingToken}`);

    expect(res.body.shipment.client).toBeUndefined();
    expect(res.body.shipment.clientId).toBeUndefined();
  });

  test('returns 404 for an unknown token', async () => {
    const res = await request(app).get('/api/v1/track/does-not-exist');
    expect(res.status).toBe(404);
  });
});
