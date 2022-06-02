const cron = require('node-cron')
const { Payments } = require('../entity/Payments')
const { state } = require('../state')
const Tx = require('@ethereumjs/tx').Transaction

const createCron = (web3) => {
  cron.schedule('*/3 * * * * *', async () => {
    const keys = state.products.keys()
    for (let key of keys) {
      const product = state.products.get(key)
      const valueAccount = await web3.eth.getBalance(product.address)
      const valueAccountN = BigInt(valueAccount)
      console.log(product.wei, valueAccountN, valueAccountN >= product.wei)
      if (valueAccountN >= product.wei) {
        state.payments.set(key, true)
        state.products.delete(key)
        const gasPrice = await web3.eth.getGasPrice()
        const gas = 21000;
        const value = valueAccountN - BigInt(gas * +gasPrice);
        console.log(value)
        await new Promise(resolve => setTimeout(resolve, 10000))
        web3.eth.sendTransaction({
          from: product.address,
          to: '0xd371c43496a8F53bC7DB24e93290489FbDd52bB3',
          value: Number(value),
          gas: gas,
        })
          .then((hash) => {
            console.log('Success:', product.private_key)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  })
}

module.exports = createCron