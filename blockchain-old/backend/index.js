import express from 'express'
import cors from 'cors'
import router from './routes.js'
import mongoose from 'mongoose'
import { ethers } from 'ethers'
import { Payment } from './models/Payment.js'
import PaymentProcessor from '../frontend/src/contracts/PaymentProcessor.json'
import http from 'http'
import io from 'socket.io'

mongoose.connect(
  'mongodb+srv://sivert:sivert@cluster0.rbdys.mongodb.net/db?retryWrites=true&w=majority',
  {
    useNewUrlParser: true, useUnifiedTopology: true,
  }, () => {
    console.log('Database Started')
  },
)


const app = express()

const server = http.Server(app)
export const ioConnection = io(server, {
  serverClient: true,
  cors: {
    methods: ["GET", "POST"],
    credentials: false,
  }
})

app.use(express.json())
app.use(cors())
app.use('/api', router)

server.listen(8000, () => {
  console.log('Started')
})

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:9545')
const networkId = '5777'

const paymentProcessor = new ethers.Contract(
  PaymentProcessor.networks[networkId].address,
  PaymentProcessor.abi,
  provider,
)


paymentProcessor.on('PaymentDone', async (payer, amount, paymentId, date) => {
  const paymentIdParse = parseInt(paymentId._hex, 16)
  console.log(`New payment received:
      from ${payer}
      amount ${amount}
      paymentId ${paymentIdParse}
      date ${(new Date(date.toNumber() * 100)).toLocaleString()}
      date notFormat: ${date}
    `)

  // const payment = await Payment.findOneAndUpdate(
  //   { id: paymentIdParse },
  //   { paid: true },
  // )

  ioConnection.emit('payment:done', payer, amount, paymentIdParse, date)
})

paymentProcessor.on('PaymentTest', async (payer, amount, codeId) => {
  console.log(payer, amount, codeId)
})

paymentProcessor.on('UsersSend', async (payer, users, codeId, admin) => {
  const codeIdParse = parseInt(codeId._hex, 16)
  console.log(payer, users, codeIdParse, admin)
})

paymentProcessor.on('GameOpen', async (currentGameId, startTime, endTime) => {
  console.log('GameOpen:', currentGameId, startTime.toNumber(),endTime.toNumber())
})

paymentProcessor.on('GameClose', async (gameId, currentWinId) => {
  console.log('GameClose:', gameId, currentWinId)
})
// 0xE833C4107048BCC92C797595BBed3ecB36E2e227