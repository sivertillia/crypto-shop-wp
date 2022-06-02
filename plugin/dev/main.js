$(document).ready(() => {
  let web3 = null
  let account = null
  let lcContract = null;
  let address = null;
  let amount = null;
  let created_time = null;
  let eth = null;
  let eth_usd = null;
  let wei = 0n;
  let order_id = null;
  let redirect_url = null;


  const generateQrCode = (valueWei, valueEth) => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      margin: 15,
      type: 'svg',
      data: `ethereum:${address}?gas=21000&value=${String(valueWei)}`,
      image: 'https://cdn.worldvectorlogo.com/logos/ethereum-1.svg',
      // image: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
      dotsOptions: {
        color: '#565656',
        // color: '#F6851B',
        type: 'rounded',
      },
      imageOptions: {
        margin: 10
      },
      backgroundOptions: {
        color: 'rgba(255,255,255,0)',
      },
      cornersSquareOptions: {
        color: '#000000',
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
    amount = $('div.hidden').data('amount')
    created_time = $('div.hidden').data('created_time')
    order_id = $('div.hidden').data('order_id')
    eth_usd = $('div.hidden').data('eth_usd')
    redirect_url = $('div.hidden').data('redirect_url')
    document.getElementById('account').value = address
    updateCoins(eth_usd)
    updateRender(wei, eth)
    createInterval()
  })();

  const formatBalanceInTime = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const seconds = Math.floor((ms / 1000) % 60)
    const daysF = (days < 10) ? '0' + days : days
    const hoursF = (hours < 10) ? '0' + hours : hours
    const minutesF = (minutes < 10) ? '0' + minutes : minutes
    const secondsF = (seconds < 10) ? '0' + seconds : seconds
    const mm_ss = `${minutesF}:${secondsF}`
    const hh_mm_ss = `${hoursF}:${minutesF}:${secondsF}`
    const dd_hh_mm_ss = `${daysF}:${hoursF}:${minutesF}:${secondsF}`
    return [hh_mm_ss, { hours, minutes, seconds }]
  }

  function createInterval() {
    const intervalId = setInterval(() => {
      const time = new Date(created_time).getTime()
      const cTime = new Date().getTime()
      const [timer, _] = formatBalanceInTime(cTime-time)
      if (cTime-time < 0 || Number.isNaN(cTime-time)) clearInterval(intervalId)
      document.getElementById('time').innerText = timer;
    }, 100)

    setInterval(async () => {
      const result = await axios.get(`http://localhost:8000/api/coin?order_id=${order_id}`);
      eth_usd = result?.data?.eth;
      updateCoins(eth_usd)
      updateRender(wei, eth)
    }, 300_000) //300_000

    setInterval(async () => {
      const response = await axios.get(`http://localhost:8000/api/payment?order_id=${order_id}`);
      if (response?.data?.payment) {
        window.location.href = redirect_url;
      }
    }, 3000)
  }

  function updateRender(valueWei, valueEth) {
    document.getElementById('amount').innerText = `${amount}$ -> ${valueEth} ETH -> ${valueWei} WEI`
    document.getElementById('canvas').innerText = ''
    generateQrCode(valueWei, valueEth)
    generateButton(valueWei, valueEth)
  }

  function updateCoins(c) {
    console.log(c)
    eth = amount / c;
    wei = BigInt(String(eth * 10**18));
  }

  function generateButton(valueWei, valueEth) {
    const button = document.getElementById('connect_metamask')
    const buttonPay = document.getElementById('pay_metamask')
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
      console.log('Click')
      // const price = ethers.utils.parseEther('0.1', 'ether')
      // await web3.
      console.log(typeof valueWei, valueWei)
      window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params:[{
            from: account,
            to: address,
            value: valueWei.toString(16),
          }],
        })
        .then(txHash => console.log(txHash))
        .catch(error => console.log(error))
      // await lcContract.methods.pay('1').send({
      //   from: account,
      //   value: '10000000000000000',
      //   gas: 300000,
      //   gasPrice: null,
      // })
    })

    buttonGetBalance.addEventListener('click', async (e) => {
      console.log(address)
      const ether = ethers.utils.formatEther(await web3.eth.getBalance(address))
      // const ether = ethers.utils.formatEther(await paymentProcessor.getBalance())
      // console.log(parseInt((await paymentProcessor.getBalance())._hex, 16))
      console.log(ether)
    })
  }

});
