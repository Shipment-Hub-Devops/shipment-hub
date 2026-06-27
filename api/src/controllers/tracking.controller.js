const db = require('../database/models');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

// Whitelist the fields that are safe to expose on a public tracking page.
// Client identity and contact details are intentionally omitted.
const toPublicShipment = (shipment) => ({
  referenceCode: shipment.referenceCode,
  status: shipment.status,
  cargoDescription: shipment.cargoDescription,
  pickupAddress: shipment.pickupAddress,
  pickupLat: shipment.pickupLat,
  pickupLng: shipment.pickupLng,
  dropoffAddress: shipment.dropoffAddress,
  dropoffLat: shipment.dropoffLat,
  dropoffLng: shipment.dropoffLng,
  currentLat: shipment.currentLat,
  currentLng: shipment.currentLng,
  currentLocationLabel: shipment.currentLocationLabel,
  createdAt: shipment.createdAt,
  updatedAt: shipment.updatedAt,
  events: (shipment.events || []).map((event) => ({
    type: event.type,
    status: event.status,
    description: event.description,
    locationLabel: event.locationLabel,
    lat: event.lat,
    lng: event.lng,
    createdAt: event.createdAt,
  })),
});

const trackShipment = catchAsync(async (req, res) => {
  const shipment = await db.Shipment.findOne({
    where: { trackingToken: req.params.token },
    include: [
      {
        model: db.ShipmentEvent,
        as: 'events',
        separate: true,
        order: [['createdAt', 'ASC']],
      },
    ],
  });

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  res.json({ shipment: toPublicShipment(shipment) });
});

module.exports = { trackShipment };
