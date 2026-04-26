const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { notEmpty: true, len: [2, 255] },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date_time: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: { isDate: true },
  },
  max_participants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 10000 },
  },
  admin_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  is_cancelled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'sessions',
  underscored: true,
});

module.exports = Session;
