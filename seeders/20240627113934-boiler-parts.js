'use strict';

const { faker } = require('@faker-js/faker');
const boilerManufacturers = [
  'Ariston',
  'Chaffoteaux&Maury',
  'Baxi',
  'Bongioanni',
  'Saunier Duval',
  'Buderus',
  'Strategist',
  'Henry',
  'Northwest',
];
const partsManufacturers = [
  'Azure',
  'Gloves',
  'Cambridgeshire',
  'Salmon',
  'Montana',
  'Sensor',
  'Lesly',
  'Radian',
  'Gasoline',
  'Croatia',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'BoilerParts',
      [...Array(100)].map(() => ({
        boiler_manufacturer:
          boilerManufacturers[
            Math.floor(Math.random() * boilerManufacturers.length)
          ],

        parts_manufacturer:
          partsManufacturers[
            Math.floor(Math.random() * partsManufacturers.length)
          ],

        name: faker.lorem.words(2),

        description: faker.lorem.sentence(2),

        vendor_code: faker.string.alphanumeric(10),

        images: JSON.stringify(
          [...Array(10)].map(
            () =>
              `${faker.image.urlLoremFlickr({ category: 'technics' })}?random${faker.string.numeric()}`,
          ),
        ),

        price: parseInt(faker.string.numeric(4)),

        in_stock: parseInt(faker.string.numeric(1)),

        popularity: parseInt(faker.string.numeric(3)),

        bestseller: faker.datatype.boolean(),

        new: faker.datatype.boolean(),

        compatibility: faker.lorem.words(7),

        createdAt: new Date(),

        updatedAt: new Date(),
      })),
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('BoilerParts', null, {});
  },
};
