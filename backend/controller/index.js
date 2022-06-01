const Dai = require('../../blockchain/build/contracts/Dai.json')
const PaymentProcessor = require('../../blockchain/build/contracts/PaymentProcessor.json')

const Web3 = require('web3')
const { Payments } = require('../entity/Payments')
const { state } = require('../state')
const axios = require('axios')

module.exports.getContract = (req, res) => {
  res.json({ dai: Dai, paymentProcessor: PaymentProcessor })
}

module.exports.initPayment = async (req, res) => {
  console.log(req.body)
  const { order_id, amount } = req.body
  const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:9545'))
  const account = web3.eth.accounts.create()
  const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
  const eth = response?.data?.ethereum?.usd;
  state.products.set(order_id, {
    amount: amount,
    address: account.address,
    private_key: account.privateKey,
    order_id: order_id,
    eth: eth,
    wei: (amount / eth) * 10**18,
    created_time: new Date().toISOString(),
    updated_time: new Date().toISOString(),
  })
  state.payments.set(order_id, false)
  const product = state.products.get(order_id)
  console.log(product)
  res.json({
    ...product,
    private_key: null,
  })
}

module.exports.getCoin = async (req, res) => {
  const { order_id } = req.query
  const product = state.products.get(+order_id)
  if (!product) return res.status(400).json({ error: 'Not Found' });
  const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
  const eth = response?.data?.ethereum?.usd;
  state.products.set(order_id, { ...product, eth: eth, wei: (product.amount / eth) * 10**18, })

  res.json({
    eth: eth,
  })
}

module.exports.checkPayment = async (req, res) => {
  const { order_id } = req.query
  console.log(state.payments.entries())
  const payment = state.payments.get(+order_id);
  if (!payment === undefined) return res.status(400).json({ error: 'Not Found' });
  res.json({
    payment: payment,
  })
}