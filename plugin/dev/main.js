$(document).ready(() => {
  const api_url = 'http://localhost:8000/api'


  let web3 = null
  let account = null
  let address = null;
  let amount = null;
  let created_time = null;
  let eth = null;
  let eth_usd = null;
  let wei = 0n;
  let order_id = null;
  let redirect_url = null;
  let coins = null;
  let coinsArray = [];
  // let useCoinsArray = [];
  let selectedCoin = 'ethereum';
  let sorterAz = true;

  const data = {
    bitcoin: {
      primaryColor: '#f7931a',
      secondaryColor: '#fc8a00',
      logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg'
    },
    ethereum: {
      primaryColor: '#565656',
      secondaryColor: '#000000',
      logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'
    },
    litecoin: {
      primaryColor: '#345d9d',
      secondaryColor: '#004098',
      logo: 'https://cryptologos.cc/logos/litecoin-ltc-logo.svg'
    },
    dai: {
      primaryColor: '#f5ac37',
      secondaryColor: '#d38400',
      logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg'
    },
    'usd-coin': {
      primaryColor: '#2775caff',
      secondaryColor: '#004083',
      logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg'
    }
  }


  const generateQrCode = (valueWei, valueEth) => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      margin: 15,
      type: 'svg',
      data: `${selectedCoin}:${address}?gas=21000&value=${String(valueWei)}`,
      image: data[selectedCoin].logo,
      // image: `https://cdn.worldvectorlogo.com/logos/${selectedCoin}.svg`,
      // image: 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg',
      dotsOptions: {
        color: data[selectedCoin].primaryColor,
        type: 'rounded',
      },
      imageOptions: {
        margin: 10
      },
      backgroundOptions: {
        color: 'rgba(255,255,255,0)',
      },
      cornersSquareOptions: {
        color: data[selectedCoin].secondaryColor,
        type: 'extra-rounded',
      },
    })

    qrCode.append(document.getElementById('canvas'))
  };

  (async () => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum)
    }
    order_id = $('div.hidden').data('order_id')
    await init()
    await updateOrderDetails()
    updateCoins(eth_usd)
    console.log(wei, eth)
    updateRender(wei, amount/coins[selectedCoin])
    createInterval()
  })();

  async function init (){
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
      const accounts = await web3.eth.getAccounts()
      account = accounts[0]
      window.ethereum.on('accountsChanged', async () => {
        const accounts = await web3.eth.getAccounts()
        account = accounts[0]
        if(account) setAddressIntoButton(account)
      })
      if(account) setAddressIntoButton(account);
    }
  }

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
    // const intervalId = setInterval(() => {
    //   const time = new Date(created_time).getTime()
    //   const cTime = new Date().getTime()
    //   const [timer, _] = formatBalanceInTime(cTime-time)
    //   if (cTime-time < 0 || Number.isNaN(cTime-time)) clearInterval(intervalId)
    //   document.getElementById('time').innerText = timer;
    // }, 100)

    setInterval(async () => {
      await updateOrderDetails()
      const response = await axios.get(`${api_url}/payment?order_id=${order_id}`);
      if (response?.data?.payment) {
        window.location.href = decodeURIComponent(redirect_url);
      }
    }, 3000)
  }

  function updateRender(valueWei, valueEth) {
    document.getElementById('amount_input').value = `${amount}$`
    document.getElementById('converted_amount').value = `${valueEth}`
    // document.getElementById('sorterToken').innerText = sorterAz ? `A-z` : `Z-a`
    document.getElementById('canvas').innerText = ''
    generateQrCode(valueWei, valueEth)
    generateButton(valueWei, valueEth)
  }

  function updateCoins(c) {
    console.log(c)
    console.log({ amount, c, eth })
    if (!amount || !coins) return
    const convertedValue = amount / coins['ethereum']
    wei = BigInt(String(Math.ceil(convertedValue * 10**18)))
  }

  async function updateOrderDetails() {
    const { data } = await axios.get(`${api_url}/order?order_id=${order_id}`)
    address = data.address;
    amount = data.amount;
    if (!coinsArray.length) sorterTokens(Object.keys(data.coins), false)
    coinsArray = Object.keys(data.coins)
    coins = data.coins;
    redirect_url = data.redirect_url;
    const convertedValue = amount / coins['ethereum']
    wei = BigInt(String(Math.ceil(convertedValue * 10**18)))
    document.getElementById('amount_input').value = `${amount}$`;
    document.getElementById('converted_amount').value = amount / coins[selectedCoin];
  }

  function setAddressIntoButton () {
    console.log('changed', account)
    const button = document.getElementById('connect_metamask')
    if (!button || !account) return
    const first4 = account.slice(0,4)
    const last4 = account.slice(account.length - 4)
    button.innerText = `${first4}...${last4}`
  }

  function renderCoinsList(coinsNames) {
    const list = document.getElementById("tokensList");
    list.innerHTML = null;

    function makeElem(coinName) {
      let li = document.createElement('li')
      li.innerHTML = `<img id="currencyImage" src="${data[coinName].logo}">${coinName}`;
      li.setAttribute("data-dismiss","modal")
      li.className = 'pointer'
      li.onclick = () => {
        $('#selectCurrencyModal').modal('hide')
        selectedCoin = coinName;
        const convertedValue = amount / coins[selectedCoin]
        wei = BigInt(String(Math.ceil(convertedValue * 10**18)))
        updateRender(wei, amount/coins[coinName])
        document.getElementById('searchToken').value = ''
        sorterTokens()
      }
      return li;
    }

    const listContainer = document.createElement('ul');
    const listFragment = document.createDocumentFragment();
    coinsNames.forEach((item) => {
      try {
        const listElement = makeElem(item);
        listFragment.append(listElement);
      } catch (Error) {
        console.log(Error);
      }
    });
    listContainer.append(listFragment);
    list.append(listContainer);
  }

  function generateButton(valueWei, valueEth) {
    const button = document.getElementById('connect_metamask')
    const buttonPay = document.getElementById('pay_metamask')
    const searchToken = document.getElementById('searchToken')
    const sorterToken = document.getElementById('sorterToken')

    if (selectedCoin) {
      document.getElementById('selectCoinButton').innerHTML = `<img id="currencyImage" src="${data[selectedCoin].logo}" /> ${selectedCoin}`;
    }

    button.onclick = async (e) => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
      }
    }

    sorterToken.onclick = async (e) => {
      sorterTokens()
    }

    searchToken.oninput = () => {
      if (!coins) return
      const searchTokenText = document.getElementById('searchToken').value.toLowerCase()
      // renderCoinsList([...coinsArray].filter(i => i.includes(searchTokenText)))
      sorterTokens([...coinsArray].filter(i => i.includes(searchTokenText)), false)
    }

    buttonPay.onclick = async (e) => {
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
    }
  }

  function sorterTokens(data = [...coinsArray], isSort = false) {
    const sorterToken = document.getElementById('sorterToken')
    let sorterArray = [...data]
    if (sorterAz) {
      sorterArray = sorterArray.sort()
    } else {
      sorterArray = sorterArray.sort().reverse()
    }
    sorterToken.innerText = sorterAz ? `A-z` : `Z-a`
    if (isSort) {
      sorterAz = !sorterAz
    }

    renderCoinsList(sorterArray)
  }
});
