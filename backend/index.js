const express = require('express')
const router = require('./routes')
const cors = require('cors')
const Web3 = require('web3')
const PaymentProcessor = require('./public/contracts/PaymentProcessor.json')
const { ethers } = require('ethers')
const createCron = require('./cron')
const app = express()
app.use(cors())
app.use(express.json())

app.use('/file', express.static(__dirname + '/public'))

app.use('/api', router);
(async () => {
	const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))
  createCron(web3)
})();

app.listen(8000, () => {
  console.log(`Server start --> http://localhost:8000/`)
})
