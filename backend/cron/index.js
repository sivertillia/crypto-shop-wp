const cron = require('node-cron')
const { Payments } = require('../entity/Payments')
const { state } = require('../state')
const Tx = require('@ethereumjs/tx').Transaction

const createCron = (web3) => {
  cron.schedule('*/3 * * * * *', async () => {
    // const keys = state.products.keys()
    // for (let key of keys) {
    //   const product = state.products.get(key)
    //   const valueAccount = await web3.eth.getBalance(product.address)
    //   const valueAccountN = BigInt(valueAccount)
    //   console.log(product.wei, valueAccountN, valueAccountN >= product.wei)
    //   if (valueAccountN >= product.wei) {
    //     state.payments.set(key, true)
    //     state.products.delete(key)
    //   }
    // }
  })
}

module.exports = createCron