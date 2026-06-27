'use strict';

const { ROLES, ROLE_VALUES } = require('../../utils/constants');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password_hash',
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ROLES.CLIENT,
        validate: { isIn: [ROLE_VALUES] },
      },
    },
    {
      tableName: 'users',
      underscored: true,
    }
  );

  // Never expose the password hash to API consumers.
  User.prototype.toSafeJSON = function toSafeJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  };

  User.associate = (models) => {
    User.hasMany(models.Shipment, { foreignKey: 'clientId', as: 'shipments' });
    User.hasMany(models.ShipmentEvent, { foreignKey: 'createdById', as: 'events' });
  };

  return User;
};
