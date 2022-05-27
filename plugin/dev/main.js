Web3 = require('web3')

let PaymentProcessorCt = null
let web3 = null
let account = null
let lcContract = null
let address = null

getContractPaymentProcessor().then(async (contract) => {
  PaymentProcessorCt = contract
  const network = window.ethereum.networkVersion || 5777
  address = PaymentProcessorCt.networks[network].address
})


async function getContractPaymentProcessor() {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: 'GET',
      url: 'http://localhost:8000/file/contracts/PaymentProcessor.json',
      dataType: 'json',
      success: (obj) => {
        resolve(obj)
      },
    })
  })
}

const paymentProcessorContract = () => {
  // const address = PaymentProcessorCt.networks[window.ethereum.networkVersion].address
  // const address = "0x5e5621d9bd5938e3244086e7a560240632109581"
  return new web3.eth.Contract(
    PaymentProcessorCt.abi,
    address,
  )
}

const getBlockchain = () => {
  return new Promise(async (resolve) => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      web3 = new Web3(window.ethereum)
      const accounts = await web3.eth.getAccounts()
      account = accounts[0]
      lcContract = paymentProcessorContract()

      const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        type: 'svg',
        data: address,
        image: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
        dotsOptions: {
          color: '#F6851B',
          type: 'rounded',
        },
        imageOptions: {
          margin: 10
        },
        backgroundOptions: {
          color: 'rgba(255,255,255,0)',
        },
        cornersSquareOptions: {
          color: '#CD6116',
          type: 'extra-rounded',
        },
      })

      qrCode.append(document.getElementById('canvas'))
      // qrCode.download({ name: 'qr', extension: 'svg' })

      console.log(account)
      lcContract.once('PaymentDone', async (error, event) => {
        console.log('----------Event----------')
        console.log(error, event)
      })
      const event = lcContract.PaymentDone({}, { fromBlock: 0, toBlock: 'latest' })
      event.watch((error, result) => {
        console.log('EVEMT')
      })



      window.ethereum.on('accountsChanged', async () => {
        const accounts = await web3.eth.getAccounts()
        console.log(accounts[0])
        account = accounts[0]
      })
      // resolve({ provider, paymentProcessor, signer })
    }
    // resolve({ provider: undefined, paymentProcessor: undefined, dai: undefined })
  })
}


const button = document.getElementById('connect_metamask')
const buttonPay = document.getElementById('pay')
const buttonGetBalance = document.getElementById('balance')

button.addEventListener('click', async (e) => {
  console.log('Click')
  const data = await getBlockchain()
  // dai = data
  // paymentProcessor = data.paymentProcessor
  // provider = data.provider
  // signer = data.signer
})

buttonPay.addEventListener('click', async (e) => {
  // const price = ethers.utils.parseEther('0.1', 'ether')
  await lcContract.methods.pay('1').send({
    from: account,
    value: '10000000000000000',
    gas: 300000,
    gasPrice: null,
  })
  // await paymentProcessor.pay(1, 1).send(value)
})

buttonGetBalance.addEventListener('click', async (e) => {
  // const ether = await lcContract.methods.getBalance().call()
  const ether = ethers.utils.formatEther(await web3.eth.getBalance(PaymentProcessorCt.networks[window.ethereum.networkVersion].address))
  // const ether = ethers.utils.formatEther(await paymentProcessor.getBalance())
  // console.log(parseInt((await paymentProcessor.getBalance())._hex, 16))
  console.log(ether)
})


