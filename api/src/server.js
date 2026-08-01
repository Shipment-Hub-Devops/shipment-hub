require('dotenv').config();

const app = require('./app');
const db = require('./database/models');

const PORT = process.env.PORT || 4000;
const MAX_RETRIES = Number(process.env.DB_CONNECT_RETRIES) || 10;
const RETRY_DELAY_MS = Number(process.env.DB_CONNECT_RETRY_DELAY_MS) || 3000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Wait for the database to accept connections. In containerised setups the API
// often starts before PostgreSQL is ready, so we retry instead of crashing.
const connectWithRetry = async () => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      await db.sequelize.authenticate();
      return;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `Database not ready (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`
      );
      if (attempt === MAX_RETRIES) throw error;
      await wait(RETRY_DELAY_MS);
    }
  }
};

(async () => {
  try {
    await connectWithRetry();

    await db.sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');

    const User = db.User || db.users;
    if (User) {
      const userCount = await User.count();
      if (userCount === 0) {
        const bcrypt = require('bcryptjs');
        const operatorPassword = await bcrypt.hash('Operator123!', 10);
        const clientPassword = await bcrypt.hash('Client123!', 10);
        
        await User.bulkCreate([
          { name: 'Operator User', email: 'operator@shipmenthub.test', passwordHash: operatorPassword, role: 'operator' },
          { name: 'Client User', email: 'client@shipmenthub.test', passwordHash: clientPassword, role: 'client' }
        ]);
        console.log('Default demo accounts seeded successfully!');
      }
    }

    // Auto-seed default demo shipment if none exist
    const Shipment = db.Shipment || db.shipments;
    const ShipmentEvent = db.ShipmentEvent || db.shipment_events;
    
    if (Shipment && User) {
      const shipmentCount = await Shipment.count();
      if (shipmentCount === 0) {
        const clientUser = await User.findOne({ where: { email: 'client@shipmenthub.test' } });
        const operatorUser = await User.findOne({ where: { email: 'operator@shipmenthub.test' } });
        
        if (clientUser) {
          const now = new Date();
          const demoShipment = await Shipment.create({
            referenceCode: 'SH-DEMO01',
            trackingToken: 'demotrack123456',
            status: 'in_transit',
            clientId: clientUser.id,
            pickupAddress: 'Kigali Special Economic Zone, Kigali, Rwanda',
            pickupLat: -1.9577,
            pickupLng: 30.0619,
            pickupContact: '+250 788 000 001',
            dropoffAddress: 'Nakawa Industrial Area, Kampala, Uganda',
            dropoffLat: 0.3476,
            dropoffLng: 32.5825,
            dropoffContact: '+256 700 000 002',
            cargoDescription: 'Palletised coffee beans (20 bags)',
            weightKg: 1200,
            quantity: 20,
            notes: 'Handle as perishable. Keep dry.',
            currentLat: -0.6072,
            currentLng: 30.6545,
            currentLocationLabel: 'Mbarara, Uganda'
          });

          if (ShipmentEvent) {
            const createEvent = (minutesAgo, status, description, label, lat, lng) => ({
              shipmentId: demoShipment.id,
              createdById: operatorUser ? operatorUser.id : null,
              type: 'status_change',
              status,
              description,
              locationLabel: label,
              lat,
              lng,
              createdAt: new Date(now.getTime() - minutesAgo * 60000),
              updatedAt: new Date(now.getTime() - minutesAgo * 60000)
            });

            await ShipmentEvent.bulkCreate([
              createEvent(600, 'pending', 'Shipment request created by client', 'Kigali, Rwanda', -1.9577, 30.0619),
              createEvent(540, 'confirmed', 'Shipment reviewed and confirmed by operations', 'Kigali, Rwanda', -1.9577, 30.0619),
              createEvent(480, 'picked_up', 'Cargo collected from pickup location', 'Kigali, Rwanda', -1.9577, 30.0619),
              createEvent(120, 'in_transit', 'In transit towards destination', 'Mbarara, Uganda', -0.6072, 30.6545)
            ]);
          }
          console.log('Demo shipment and timeline events seeded successfully!');
        }
      }
    }

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`ShipmentHub API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to start server:', error);
    process.exit(1);
  }
})();