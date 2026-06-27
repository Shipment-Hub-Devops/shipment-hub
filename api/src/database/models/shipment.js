'use strict';

const {
  SHIPMENT_STATUS,
  SHIPMENT_STATUS_VALUES,
} = require('../../utils/constants');

module.exports = (sequelize, DataTypes) => {
  const Shipment = sequelize.define(
    'Shipment',
    {
      referenceCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'reference_code',
      },
      trackingToken: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'tracking_token',
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: SHIPMENT_STATUS.PENDING,
        validate: { isIn: [SHIPMENT_STATUS_VALUES] },
      },
      pickupAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'pickup_address',
      },
      pickupLat: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'pickup_lat',
      },
      pickupLng: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'pickup_lng',
      },
      pickupContact: {
        type: DataTypes.STRING,
        field: 'pickup_contact',
      },
      dropoffAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'dropoff_address',
      },
      dropoffLat: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'dropoff_lat',
      },
      dropoffLng: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'dropoff_lng',
      },
      dropoffContact: {
        type: DataTypes.STRING,
        field: 'dropoff_contact',
      },
      cargoDescription: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'cargo_description',
      },
      weightKg: {
        type: DataTypes.FLOAT,
        field: 'weight_kg',
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      currentLat: {
        type: DataTypes.FLOAT,
        field: 'current_lat',
      },
      currentLng: {
        type: DataTypes.FLOAT,
        field: 'current_lng',
      },
      currentLocationLabel: {
        type: DataTypes.STRING,
        field: 'current_location_label',
      },
    },
    {
      tableName: 'shipments',
      underscored: true,
    }
  );

  Shipment.associate = (models) => {
    Shipment.belongsTo(models.User, { foreignKey: 'clientId', as: 'client' });
    Shipment.hasMany(models.ShipmentEvent, {
      foreignKey: 'shipmentId',
      as: 'events',
    });
  };

  return Shipment;
};
