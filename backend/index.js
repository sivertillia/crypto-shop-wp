const express = require('express')
const router = require('./routes')
const cors = require('cors')
const Web3 = require('web3')
const PaymentProcessor = require('./public/contracts/PaymentProcessor.json')
const { ethers } = require('ethers')
const app = express()
app.use(cors())

app.use('/file', express.static(__dirname + '/public'))

app.use('/api', router)

app.listen(8000, () => {
  console.log(`Server start --> http://localhost:8000/`)
})

const init = async () => {
  const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:9545'))
  const networkId = 5777

  const paymentProcessor = new web3.eth.Contract(
    PaymentProcessor.abi,
    PaymentProcessor.networks[networkId].address,
  )

  // paymentProcessor.events.allEvents({}, (e) => {
  //   console.log(e)
  // })
  // console.log(result)
  // const event = paymentProcessor.PaymentDone({}, { fromBlock: 0, toBlock: 'latest' })
  // event.watch((error, result) => {
  //   console.log('EVEMT')
  // })
  paymentProcessor.events.allEvents({
    fromBlock: 0,
    toBlock: 'latest',
  }, (error, event) => {
    console.log('allEvents', event)
  })

  // paymentProcessor.once('PaymentDone', async (error, event) => {
  //   console.log('----------Event----------')
  //   // window.href.
  // })
  //
  // paymentProcessor.once('ReceiveEvent', async (error, event) => {
  //   console.log('----------Event ReceiveEvent----------')
  //   console.log(1111)
  //   // window.href.
  // })
  // paymentProcessor.getPastEvents('PaymentDone', {})
  //   .then(results => console.log(results))
  //   .catch(err => console.log(err));
}

init()
const init2 = async () => {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:9545')
  const networkId = '5777'
  const paymentProcessor = new ethers.Contract(
    PaymentProcessor.networks[networkId].address,
    PaymentProcessor.abi,
    provider,
  )
  paymentProcessor.on('PaymentDone', async (payer, paymentId, date) => {
    const paymentIdParse = parseInt(paymentId._hex, 16)
    console.log(`New payment received:
      from ${payer}
      paymentId ${paymentIdParse}
      date ${(new Date(date.toNumber() * 100)).toLocaleString()}
      date notFormat: ${date}
    `)

    // const payment = await Payment.findOneAndUpdate(
    //   { id: paymentIdParse },
    //   { paid: true },
    // )

    // ioConnection.emit('payment:done', payer, amount, paymentIdParse, date)
    return null
  })
}

// init2()

