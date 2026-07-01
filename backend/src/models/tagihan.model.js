const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tagihan = sequelize.define(
  'Tagihan',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    unit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    periode: {
      // format YYYY-MM
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('belum_bayar', 'lunas'),
      defaultValue: 'belum_bayar',
    },
    jatuh_tempo: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    tanggal_bayar: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: 'invoices', // nama tabel di DB "invoices" (model/JS tetap disebut Tagihan)
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Tagihan;
