const sequelize = require('../config/database');
const User = require('./User');
const Session = require('./Session');
const Booking = require('./Booking');

// User → Sessions (one-to-many)
User.hasMany(Session, { foreignKey: 'admin_id', as: 'sessions', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' });

// Session → Bookings (one-to-many)
Session.hasMany(Booking, { foreignKey: 'session_id', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });

module.exports = { sequelize, User, Session, Booking };
