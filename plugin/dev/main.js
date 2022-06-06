$(document).ready(() => {
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
  let coinsArray = null;
  let selectedCoin = 'ethereum';

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
    updateOrderDetails()
    updateCoins(eth_usd)
    updateRender(wei, eth)
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

    // setInterval(async () => {
    //   const result = await axios.get(`http://localhost:8000/api/coin?order_id=${order_id}`);
    //   eth_usd = result?.data?.eth;
    //   updateCoins(eth_usd)
    //   updateRender(wei, eth)
    // }, 300_000) //300_000

    setInterval(async () => {
      updateOrderDetails()
      const response = await axios.get(`http://localhost:8000/api/payment?order_id=${order_id}`);
      if (response?.data?.payment) {
        window.location.href = redirect_url;
      }
    }, 3000)
  }

  function updateRender(valueWei, valueEth) {
    document.getElementById('amount_input').value = `${amount}$`
    document.getElementById('converted_amount').value = `${valueEth}`
    document.getElementById('canvas').innerText = ''
    generateQrCode(valueWei, valueEth)
    generateButton(valueWei, valueEth)
  }

  function updateCoins(c) {
    console.log(c)
    console.log({ amount, c, eth })
    if (!amount || !coins) return
    const convertedValue = amount / coins[selectedCoin]
    wei = BigInt(String(convertedValue * 10**18));
  }

  function updateOrderDetails() {
    axios.get(`http://localhost:8000/api/order?order_id=${order_id}`).then(({ data }) => {
      address = data.address;
      amount = data.amount;
      if (!coinsArray) renderCoinsList(Object.keys(data.coins))
      coinsArray = Object.keys(data.coins)
      coins = data.coins;
      console.log({ coins })
      const convertedValue = amount / coins[selectedCoin]
      wei = BigInt(String(convertedValue * 10**18))
      console.log(data);
      document.getElementById('amount_input').value = `${amount}$`;
      document.getElementById('converted_amount').value = amount / coins[selectedCoin];
    });
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
      li.onclick = () => {
        selectedCoin = coinName;
        updateRender(wei, amount/coins[coinName])
        document.getElementById('searchToken').value = ''
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

    button.addEventListener('click', async (e) => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
      }
    })
    let sorter = true;

    sorterToken.onclick = async (e) => {

      let sorterArray = [...coinsArray]
      console.log({ sorterArray })
      if (sorter) {
        sorter = false
        sorterArray = sorterArray.sort()
      } else {
        sorter = true
        sorterArray = sorterArray.sort().reverse()
      }
      console.log(sorterArray, sorter)
      renderCoinsList(sorterArray)
    }

    searchToken.oninput = () => {
      if (!coins) return
      const searchTokenText = document.getElementById('searchToken').value.toLowerCase()
      console.log(searchTokenText, coins)
      renderCoinsList(coinsArray.filter(i => i.includes(searchTokenText)))
    }

    buttonPay.onclick = async (e) => {
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
    }
  //   buttonGetBalance.addEventListener('click', async (e) => {
  //     console.log(address)
  //     const ether = ethers.utils.formatEther(await web3.eth.getBalance(address))
  //     // const ether = ethers.utils.formatEther(await paymentProcessor.getBalance())
  //     // console.log(parseInt((await paymentProcessor.getBalance())._hex, 16))
  //     console.log(ether)
  //   })
  }

});
