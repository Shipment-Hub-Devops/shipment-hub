'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shipments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      reference_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      tracking_token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      pickup_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pickup_lat: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      pickup_lng: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      pickup_contact: {
        type: Sequelize.STRING,
      },
      dropoff_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dropoff_lat: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      dropoff_lng: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      dropoff_contact: {
        type: Sequelize.STRING,
      },
      cargo_description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      weight_kg: {
        type: Sequelize.FLOAT,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      current_lat: {
        type: Sequelize.FLOAT,
      },
      current_lng: {
        type: Sequelize.FLOAT,
      },
      current_location_label: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('shipments');
  },
};
