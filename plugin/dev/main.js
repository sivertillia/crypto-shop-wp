$(document).ready(() => {
  let web3 = null
  let account = null
  let lcContract = null;
  let address = null;


  const generateQrCode = () => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      margin: 15,
      type: 'svg',
      data: `ethereum:${address}/pay?gas=300000&value=1e18&uint256=3`,
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
  };

  (() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum)
    }

    address = $('div.hidden').data('address')
    generateQrCode()
  })();



  const button = document.getElementById('connect_metamask')
  const buttonPay = document.getElementById('pay')
  const buttonGetBalance = document.getElementById('balance')

  button.addEventListener('click', async (e) => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const accounts = await web3.eth.getAccounts()
      account = accounts[0]
      window.ethereum.on('accountsChanged', async () => {
        const accounts = await web3.eth.getAccounts()
        account = accounts[0]
      })
    }
  })

  buttonPay.addEventListener('click', async (e) => {
    // const price = ethers.utils.parseEther('0.1', 'ether')
    // await web3.
    await lcContract.methods.pay('1').send({
      from: account,
      value: '10000000000000000',
      gas: 300000,
      gasPrice: null,
    })
  })

  buttonGetBalance.addEventListener('click', async (e) => {
    console.log(address)
    const ether = ethers.utils.formatEther(await web3.eth.getBalance(address))
    // const ether = ethers.utils.formatEther(await paymentProcessor.getBalance())
    // console.log(parseInt((await paymentProcessor.getBalance())._hex, 16))
    console.log(ether)
  })


});
