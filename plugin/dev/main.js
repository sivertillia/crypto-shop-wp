// import PaymentProcessor from 'file:///home/user/WebstormProjects/crypto-shop-wp/blockchain/build/contracts/PaymentProcessor.json'
// const PaymentProcessor = await import('/home/user/WebstormProjects/blockchain/build/contracts/PaymentProcessor.json', { assert: { type: 'json' } })
// const PaymentProcessor = import('http://localhost:8000/file/contracts/PaymentProcessor.json', { assert: { type: 'json' } })
// const Dai = import('http://localhost:8000/file/contracts/Dai.json', { assert: { type: 'json' } })
// const Dai = '/home/user/WebstormProjects/blockchain/build/contracts/Dai.json'
let PaymentProcessor = null
let Dai = null
getContractPaymentProcessor().then(async (contract) => {
  // if (!Object.keys(contract).length) return
  console.log(contract)
  PaymentProcessor = contract
  // Dai = await import('http://localhost:8000/file/contracts/Dai.json', { assert: { type: 'json' } })
})

getContractDai().then(async (contract) => {
  console.log(contract)
  Dai = contract
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

async function getContractDai() {
  return new Promise((resolve, reject) => {
    jQuery.ajax({
      type: 'GET',
      url: 'http://localhost:8000/file/contracts/Dai.json',
      dataType: 'json',
      success: (obj) => {
        resolve(obj)
      },
    })
  })
}

const getBlockchain = () => {
  return new Promise(async (resolve) => {
    console.log(window.ethereum, PaymentProcessor, Dai)
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      console.log(await signer.getAddress())
      console.log(window.ethereum.networkVersion)
      console.log(PaymentProcessor)
      const paymentProcessor = new ethers.Contract(
        PaymentProcessor.networks[window.ethereum.networkVersion].address,
        PaymentProcessor.abi,
        signer,
      )
      const dai = new ethers.Contract(
        Dai.networks[window.ethereum.networkVersion].address, //for mainnet and public testnet replace by address of already deployed dai token
        Dai.abi,
        signer,
      )

      resolve({ provider, paymentProcessor, dai })
    }
    resolve({ provider: undefined, paymentProcessor: undefined, dai: undefined })
  })
}

const button = document.getElementById('connect_metamask')
const buttonPay = document.getElementById('pay')
let dai = null
let paymentProcessor = null
let provider = null
button.addEventListener('click',async (e) => {
  console.log('Click')
  const data = await getBlockchain()
  dai = data.dai
  paymentProcessor = data.paymentProcessor
  provider = data.provider
})

buttonPay.addEventListener('click', async (e) => {
  const price = ethers.utils.parseEther('100')
  const tx1 = await dai.approve(paymentProcessor.address, price)
  await tx1.wait()
  const tx2 = await paymentProcessor.pay(price, 1)
  await tx2.wait()
})