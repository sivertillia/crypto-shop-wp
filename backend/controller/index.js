const Dai = require('../../blockchain/build/contracts/Dai.json')
const PaymentProcessor = require('../../blockchain/build/contracts/PaymentProcessor.json')

module.exports.getContract = (req, res) => {
  res.json({ dai: Dai, paymentProcessor: PaymentProcessor })
}