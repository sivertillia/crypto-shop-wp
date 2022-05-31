const { sequelize } = require('../db/db')
const { DataTypes } = require('sequelize')


const Payments = sequelize.define('Payments', {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  private_key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  created_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_time: {
    type: DataTypes.DATE,
  },

}, { timestamps: false });



module.exports.Payments = Payments