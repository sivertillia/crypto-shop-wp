const Web3 = require('web3')
const { state } = require('../state')
const axios = require('axios')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545')) //ws://localhost:9545

const minABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

const contractDai = new web3.eth.Contract(minABI, '0x31F42841c2db5173425b5223809CF3A38FEde360')
const contractUsdc = new web3.eth.Contract(minABI, '0x07865c6E87B9F70255377e024ace6630C1Eaa37F')

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
    redirect_url: product.redirect_url,
  })
}

module.exports.getCoins = async () => {
  const arrayCoins = ['ethereum','bitcoin','litecoin', 'dai', 'usd-coin']
  const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${arrayCoins.join(',')}&vs_currencies=usd`)
  let data = {}
  arrayCoins.forEach((i) => {
    data[i] = response.data[i].usd
  })
  return data
}

module.exports.getData = async (req, res) => {
  // const tokens = ['', '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'] //DAI, USD//C,
  const wallet = '0xd371c43496a8F53bC7DB24e93290489FbDd52bB3' //
  const balance = await contractUsdc.methods.balanceOf(wallet).call()
  // const data = await Promise.all(tokens.map(async (token) => {
  //
  //   // const balance =
    const format = web3.utils.toWei(balance, 'Gwei')
  //   return {balance, format}
  // }))
  res.json({ balance, format })
}

module.exports.checkPayment = async (req, res) => {
  const { order_id } = req.query
  const product = state.products.get(+order_id)
  if (!product) return res.status(400).json({ error: 'Not Found' })
  const valueAccountEthN = BigInt(await web3.eth.getBalance(product.address))
  const valueAccountDaiN = BigInt(await contractDai.methods.balanceOf(product.address).call())
  const valueAccountUsdcN = BigInt(await contractUsdc.methods.balanceOf(product.address).call())
  const eth = product.amount / product.coins.ethereum
  const dai = product.amount / product.coins.dai
  const usdc = product.amount / product.coins['usd-coin']
  // const productValueEthN = web3.utils.toWei(String(eth), 'wei')
  const productValueEthN = BigInt(String(Math.ceil(eth * 10 ** 18)))
  const productValueDaiN = BigInt(String(Math.ceil(dai * 10 ** 18)))
  const productValueUsdcN = BigInt(String(Math.ceil(usdc * 10 ** 18)))
  const getPrice = {
    ethereum: productValueEthN,
    dai: productValueDaiN,
  }
  console.log(productValueEthN, valueAccountEthN, valueAccountEthN >= productValueEthN)
  console.log(productValueDaiN, valueAccountDaiN, valueAccountDaiN >= productValueDaiN)
  console.log(productValueUsdcN, valueAccountUsdcN, valueAccountUsdcN >= productValueUsdcN, '\n')
  if (valueAccountEthN >= productValueEthN || valueAccountDaiN >= productValueDaiN || valueAccountUsdcN >= productValueUsdcN) {
    // const gasPrice = await web3.eth.getGasPrice()
    // const gas = 21000;
    // const gasWei = BigInt(gas * +gasPrice)
    // console.log(gasWei) // 42000000000000
    // const value = valueAccountEthN - gasWei;
    // console.log(Number(value), value)
    // console.log('TEST', gas * gasPrice + Number(value))
    // web3.eth.sendTransaction({
    //   from: product.address,
    //   to: '0xd371c43496a8F53bC7DB24e93290489FbDd52bB3',
    //   value: Number(value),
    //   gas: gas,
    // })
    //   .then((hash) => {
    //     console.log('Success:', product.private_key)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
    return res.json({
      payment: true,
    })
  }
  res.json({
    payment: false,
  })
}