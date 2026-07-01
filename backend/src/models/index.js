const sequelize = require('../config/database');
const User = require('./user.model');
const Unit = require('./unit.model');
const Tagihan = require('./tagihan.model');

// Asosiasi
// User (role pemilik) 1 - N Unit
User.hasMany(Unit, { foreignKey: 'pemilik_id', as: 'units' });
Unit.belongsTo(User, { foreignKey: 'pemilik_id', as: 'pemilik' });

// Unit 1 - N Tagihan
Unit.hasMany(Tagihan, { foreignKey: 'unit_id', as: 'tagihans' });
Tagihan.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

module.exports = {
  sequelize,
  User,
  Unit,
  Tagihan,
};
