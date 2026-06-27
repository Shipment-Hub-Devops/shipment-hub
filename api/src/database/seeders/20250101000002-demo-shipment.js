'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const [clientRows] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'client@shipmenthub.test' LIMIT 1;"
    );
    const [operatorRows] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'operator@shipmenthub.test' LIMIT 1;"
    );
    if (!clientRows.length) return;

    const clientId = clientRows[0].id;
    const operatorId = operatorRows.length ? operatorRows[0].id : null;

    // Demo corridor: Kigali (RW) -> Kampala (UG), currently near Mbarara.
    await queryInterface.bulkInsert('shipments', [
      {
        reference_code: 'SH-DEMO01',
        tracking_token: 'demotrack123456',
        status: 'in_transit',
        client_id: clientId,
        pickup_address: 'Kigali Special Economic Zone, Kigali, Rwanda',
        pickup_lat: -1.9577,
        pickup_lng: 30.0619,
        pickup_contact: '+250 788 000 001',
        dropoff_address: 'Nakawa Industrial Area, Kampala, Uganda',
        dropoff_lat: 0.3476,
        dropoff_lng: 32.5825,
        dropoff_contact: '+256 700 000 002',
        cargo_description: 'Palletised coffee beans (20 bags)',
        weight_kg: 1200,
        quantity: 20,
        notes: 'Handle as perishable. Keep dry.',
        current_lat: -0.6072,
        current_lng: 30.6545,
        current_location_label: 'Mbarara, Uganda',
        created_at: now,
        updated_at: now,
      },
    ]);

    const [shipmentRows] = await queryInterface.sequelize.query(
      "SELECT id FROM shipments WHERE tracking_token = 'demotrack123456' LIMIT 1;"
    );
    const shipmentId = shipmentRows[0].id;

    const at = (minutesAgo, data) => ({
      shipment_id: shipmentId,
      created_by_id: operatorId,
      created_at: new Date(now.getTime() - minutesAgo * 60000),
      updated_at: new Date(now.getTime() - minutesAgo * 60000),
      ...data,
    });

    await queryInterface.bulkInsert('shipment_events', [
      at(600, {
        type: 'status_change',
        status: 'pending',
        description: 'Shipment request created by client',
        location_label: 'Kigali, Rwanda',
        lat: -1.9577,
        lng: 30.0619,
      }),
      at(540, {
        type: 'status_change',
        status: 'confirmed',
        description: 'Shipment reviewed and confirmed by operations',
        location_label: 'Kigali, Rwanda',
        lat: -1.9577,
        lng: 30.0619,
      }),
      at(480, {
        type: 'status_change',
        status: 'picked_up',
        description: 'Cargo collected from pickup location',
        location_label: 'Kigali, Rwanda',
        lat: -1.9577,
        lng: 30.0619,
      }),
      at(120, {
        type: 'status_change',
        status: 'in_transit',
        description: 'In transit towards destination',
        location_label: 'Mbarara, Uganda',
        lat: -0.6072,
        lng: 30.6545,
      }),
    ]);
  },

  async down(queryInterface) {
    const [shipmentRows] = await queryInterface.sequelize.query(
      "SELECT id FROM shipments WHERE tracking_token = 'demotrack123456' LIMIT 1;"
    );
    if (shipmentRows.length) {
      await queryInterface.bulkDelete('shipment_events', {
        shipment_id: shipmentRows[0].id,
      });
    }
    await queryInterface.bulkDelete('shipments', {
      tracking_token: 'demotrack123456',
    });
  },
};
