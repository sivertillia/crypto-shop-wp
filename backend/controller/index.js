const Dai = require('../../blockchain/build/contracts/Dai.json')
const PaymentProcessor = require('../../blockchain/build/contracts/PaymentProcessor.json')

const Web3 = require('web3')
const { Payments } = require('../entity/Payments')

module.exports.getContract = (req, res) => {
  res.json({ dai: Dai, paymentProcessor: PaymentProcessor })
}

module.exports.initPayment = async (req, res) => {
  console.log(req.body)
  const { order_id, amount } = req.body
  const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:9545'))
  const account = web3.eth.accounts.create()
  const payment = await Payments.create({
    amount: amount,
    address: account.address,
    private_key: account.privateKey,
    order_id: order_id,
    created_time: new Date().toISOString(),
  })
  await payment.save()

  res.json({
    payment_id: payment.payment_id,
    order_id: payment.order_id,
    address: payment.address,
    amount: payment.amount,
  })
}