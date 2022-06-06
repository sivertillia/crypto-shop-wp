const cron = require('node-cron')
const { state } = require('../state')

const createCron = (web3) => {
  cron.schedule('*/3 * * * * *', () => {
  }, {})
}

module.exports = createCron