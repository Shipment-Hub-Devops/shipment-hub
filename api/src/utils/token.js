const crypto = require('crypto');

// Public, non-enumerable token used in shareable tracking links.
const generateTrackingToken = () => crypto.randomBytes(8).toString('hex');

// Human-friendly shipment reference, e.g. SH-9F3A1C.
const generateReferenceCode = () =>
  `SH-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

module.exports = { generateTrackingToken, generateReferenceCode };