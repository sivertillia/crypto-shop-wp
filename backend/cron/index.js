const cron = require('node-cron')
const { state } = require('../state')
const { getCoins } = require('../controller')

const createCron = (web3) => {
  cron.schedule('*/3 * * * * *', async () => {
    // Testing!!!
    const keys = state.products.keys()
    for (let key of keys) {
      const product = state.products.get(key)
      const productUpdatedTime = new Date(product.updated_time).getTime()
      const currentTime = new Date().getTime()
      const fiveMin = 300000
      if ((currentTime - productUpdatedTime) >= fiveMin) {
        const coins = await getCoins()
        state.products.set(key, {
          ...product,
          coins: coins,
        })
      }
    }
  }, {})
}

module.exports = createCron