const ROLES = {
  CLIENT: 'client',
  OPERATOR: 'operator',
};
const ROLE_VALUES = Object.values(ROLES);

const SHIPMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};
const SHIPMENT_STATUS_VALUES = Object.values(SHIPMENT_STATUS);

const EVENT_TYPE = {
  STATUS_CHANGE: 'status_change',
  LOCATION_UPDATE: 'location_update',
  NOTE: 'note',
};
const EVENT_TYPE_VALUES = Object.values(EVENT_TYPE);

module.exports = {
  ROLES,
  ROLE_VALUES,
  SHIPMENT_STATUS,
  SHIPMENT_STATUS_VALUES,
  EVENT_TYPE,
  EVENT_TYPE_VALUES,
};
