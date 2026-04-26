const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  session_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'sessions', key: 'id' },
  },
  student_name: {
    type: DataTypes.STRING(150),
    allowNull: false,
    validate: { notEmpty: true, len: [2, 150] },
  },
  student_email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: { isEmail: true },
  },
  booking_ref: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  is_cancelled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'bookings',
  underscored: true,
  hooks: {
    beforeCreate: (booking) => {
      if (!booking.booking_ref) {
        // Generate short, human-readable reference: BK-XXXXXX
        booking.booking_ref = 'BK-' + uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
      }
    },
  },
});

module.exports = Booking;
