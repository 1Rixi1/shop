'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BoilerParts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      boiler_manufacturer: {
        type: Sequelize.STRING,
      },
      parts_manufacturer: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: { type: Sequelize.STRING(2048) },
      vendor_code: { type: Sequelize.STRING },
      images: { type: Sequelize.STRING(2048) },
      price: { type: Sequelize.INTEGER },
      in_stock: { type: Sequelize.INTEGER },
      popularity: { type: Sequelize.INTEGER },
      bestseller: { type: Sequelize.BOOLEAN },
      new: { type: Sequelize.BOOLEAN },
      compatibility: { type: Sequelize.STRING(2048) },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BoilerParts');
  },
};
