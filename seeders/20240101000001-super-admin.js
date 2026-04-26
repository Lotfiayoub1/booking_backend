'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

module.exports = {
  async up(queryInterface) {
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@school.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123';
    const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

    const [existing] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = '${email}' LIMIT 1`
    );
    if (existing.length > 0) return;

    const hashed = await bcrypt.hash(password, 12);

    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      name,
      email,
      password: hashed,
      role: 'super_admin',
      subscription_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }]);
  },

  async down(queryInterface) {
    const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@school.com';
    await queryInterface.bulkDelete('users', { email }, {});
  },
};
