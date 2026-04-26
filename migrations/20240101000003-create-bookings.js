'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false,
      },
      session_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'sessions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      student_name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      student_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      booking_ref: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      is_cancelled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('bookings', ['session_id']);
    await queryInterface.addIndex('bookings', ['booking_ref'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('bookings');
  },
};
