const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('postgres://postgres:1111@localhost:5432/crypto-shop')

module.exports.sequelize = sequelize;
(async () => {
  // await sequelize.sync({ force: true });
})();