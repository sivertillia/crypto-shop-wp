const Web3 = require('web3')
const { state } = require('../state')
const axios = require('axios')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:9545'))

module.exports.initOrder = async (req, res) => {
  const { order_id, amount, redirect_url } = req.body
  const accountData = web3.eth.accounts.create()
  const password = 'test'
  const account = await web3.eth.personal.importRawKey(accountData.privateKey, password)
  console.log(account, accountData.address)
  await web3.eth.personal.unlockAccount(account, password, 100000)
  const coins = await this.getCoins()
  state.products.set(order_id, {
    amount: amount,
    address: account,
    private_key: accountData.privateKey,
    password: password,
    order_id: order_id,
    redirect_url: redirect_url,
    coins: coins,
    created_time: new Date().toISOString(),
    updated_time: new Date().toISOString(),
  })
  state.payments.set(order_id, false)
  const product = state.products.get(order_id)
  console.log(product)
  res.json({
    success: true,
  })
}

module.exports.getOrder = async (req, res) => {
  const { order_id } = req.query
  const product = state.products.get(+order_id)
  if (!product) return res.status(400).json({ error: 'Not Found' })
  res.json({
    coins: product.coins,
    amount: product.amount,
    created_time: product.created_time,
    address: product.address,
  })
}

module.exports.getCoins = async () => {
  const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd`)
  const ethereum = response?.data?.ethereum?.usd;
  const bitcoin = response?.data?.bitcoin?.usd;
  return {
    ethereum: ethereum,
    bitcoin: bitcoin,
  }
}

module.exports.checkPayment = async (req, res) => {
  const { order_id } = req.query
  const product = state.products.get(+order_id)
  if (!product) return res.status(400).json({ error: 'Not Found' })
  const valueAccountN = BigInt(await web3.eth.getBalance(product.address))
  const eth = product.amount * product.coins.ethereum
  const productValueN = BigInt(eth * 10 ** 18)
  console.log(productValueN, valueAccountN, valueAccountN >= productValueN)
  if (valueAccountN >= productValueN) {
    const gasPrice = await web3.eth.getGasPrice()
    const gas = 21000;
    const value = valueAccountN - BigInt(gas * +gasPrice);
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
    return res.json({
      payment: true,
    })
  }
  res.json({
    payment: false,
  })
}