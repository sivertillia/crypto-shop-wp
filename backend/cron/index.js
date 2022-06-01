const cron  = require('node-cron')
const { Payments } = require('../entity/Payments')
const { state } = require('../state')

const createCron = (web3) => {
  cron.schedule('*/3 * * * * *', async () => {
    const keys = state.products.keys()
    for (let key of keys) {
      const product = state.products.get(key)
      const valueAccount = await web3.eth.getBalance(product.address)
      console.log(product.wei, valueAccount)
      if (valueAccount >= product.wei) {
        state.payments.set(key, true)
        state.products.delete(key)
        console.log(true)
        web3.eth.signTransaction({
          to: '0xd371c43496a8F53bC7DB24e93290489FbDd52bB3',
          value: valueAccount,
          gas: 30000,
        }, product.private_key).then((receipt) => {
          console.log('Then:', receipt)
          web3.eth.sendSignedTransaction(receipt.raw).on('receipt', console.log)
        })
          .catch((err) => {
            console.log('Catch:', err)
          })
      }
    }
  })
}


console.log(123)

module.exports = createCron