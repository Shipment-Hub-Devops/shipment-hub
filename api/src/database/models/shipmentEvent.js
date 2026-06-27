'use strict';

const { EVENT_TYPE, EVENT_TYPE_VALUES } = require('../../utils/constants');

module.exports = (sequelize, DataTypes) => {
  const ShipmentEvent = sequelize.define(
    'ShipmentEvent',
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: EVENT_TYPE.STATUS_CHANGE,
        validate: { isIn: [EVENT_TYPE_VALUES] },
      },
      status: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      locationLabel: {
        type: DataTypes.STRING,
        field: 'location_label',
      },
      lat: {
        type: DataTypes.FLOAT,
      },
      lng: {
        type: DataTypes.FLOAT,
      },
    },
    {
      tableName: 'shipment_events',
      underscored: true,
    }
  );

  ShipmentEvent.associate = (models) => {
    ShipmentEvent.belongsTo(models.Shipment, {
      foreignKey: 'shipmentId',
      as: 'shipment',
    });
    ShipmentEvent.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });
  };

  return ShipmentEvent;
};
