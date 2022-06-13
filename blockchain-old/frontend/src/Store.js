import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { connect, getPaymentDoneSocket } from './socket'


const API_URL = 'http://localhost:8000'

const ITEMS = [
  {
    id: 1,
    price: ethers.utils.parseEther('100'),
  },
  {
    id: 2,
    price: ethers.utils.parseEther('200'),
  },
]

const ITEMS_V2 = [
  {
    id: 123456789,
    price: ethers.utils.parseEther('200'),
  },
  {
    id: 987654321,
    price: ethers.utils.parseEther('200'),
  },
]

function Store({ paymentProcessor, dai }) {

  const [amount, setAmountState] = useState('')

  const buy = async item => {
    try {
      console.log('123123')
      const response1 = await axios.get(`${API_URL}/api/getPaymentId/${item.id}`)
      console.log(response1)

      console.log(0, paymentProcessor)
      const tx1 = await dai.approve(paymentProcessor.address, item.price)
      console.log(1)
      await tx1.wait()
      console.log(2)
      const tx2 = await paymentProcessor.pay(item.price, parseInt(response1.data.paymentId))
      await tx2.wait()
      await new Promise(resolve => setTimeout(resolve, 10000))
      console.log(3)
      const tx3 = await paymentProcessor.saveUser(item.price, 1)
      await tx3.wait()
      console.log(4)
      const tx4 = await paymentProcessor.sendUsers()
      await tx4.wait()

      await new Promise(resolve => setTimeout(resolve, 5000))
      console.log(5)
      const response2 = await axios.get(`${API_URL}/api/getItemUrl/${response1.data.paymentId}`)
      console.log(response2)
    } catch (e) {
      console.log(e)
    }
  }
  const buy_v2 = async item => {
    try {
      console.log('start')
      // const response1 = await axios.get(`${API_URL}/api/getPaymentId/${item.id}`)
      // const tx1 = await dai.approve(paymentProcessor.address, item.price)
      // await tx1.wait()
      // const tx2 = await paymentProcessor.pay(item.price, parseInt(response1.data.paymentId))
      // await tx2.wait()
      // await new Promise(resolve => setTimeout(resolve, 10000))
      // console.log(3)
      const tx3 = await paymentProcessor.saveUser(item.price, item.id)
      await tx3.wait()
      console.log('wait...')
      await new Promise(resolve => setTimeout(resolve, 5000))
      console.log('go go go!')
      // console.log('send Users')
      const tx4 = await paymentProcessor.sendUsers()
      await tx4.wait()

      // await new Promise(resolve => setTimeout(resolve, 5000))
      // console.log(5)
      // const response2 = await axios.get(`${API_URL}/api/getItemUrl/${response1.data.paymentId}`)
      // console.log(response2)
      console.log('end')
    } catch (e) {
      console.log(e)
    }
  }
  const start = async () => {
    const time = (Date.now() / 1000) + 180
    console.log(time)
    const tx1 = await paymentProcessor.startGame(parseInt(time))
    await tx1.wait()
  }
  const stop = async () => {
    try {
      console.log(Date.now())
      const tx1 = await dai.approve(paymentProcessor.address, ethers.utils.parseEther('1000'))
      await tx1.wait()
      const tx2 = await paymentProcessor.closeGame()
      await tx2.wait()
    } catch (e) {
      const message = e?.data?.message
      console.log(message || e)
    }
  }

  const clear_contract = async () => {
    try {
      console.log('start clearing contract')
      const tx1 = await paymentProcessor.clearContract()
      await tx1.wait()
      console.log('end clearing contact')
    } catch (e) {
      console.log(e)
    }
  }

  const send = async (data_num) => {
    try {
      const amountDai = ethers.utils.parseEther(amount)
      const tx1 = await dai.approve(paymentProcessor.address, ethers.utils.parseEther('1000000'))
      await tx1.wait()
      const tx2 = await paymentProcessor.payGame(amountDai, data_num)
      // const tx2 = await paymentProcessor.payGame(amountDai, 987654321)
      await tx2.wait()
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    connect(API_URL, () => {
      console.log('connect')
    })
  }, [])

  useEffect(() => {
    getPaymentDoneSocket(data => {
      alert(`Заказ з айди ` + data.paymentId + ` был оплачен!!`)
    })
  }, [])

  return (
    <ul className="list-group">
      <li className="list-group-item">
        Buy item1 - <span className="font-weight-bold">100 DAI</span>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={() => buy(ITEMS[0])}
        >
          Buy
        </button>
      </li>
      <li className="list-group-item">
        Buy item2 - <span className="font-weight-bold">200 DAI</span>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={() => buy(ITEMS[1])}
        >
          Buy
        </button>
      </li>
      <li className="list-group-item">
        Поставить на коня - <span className="font-weight-bold">200 DAI</span>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={() => buy_v2(ITEMS_V2[0])}
        >
          ID - {ITEMS_V2[0].id}
        </button>
      </li>
      <li className="list-group-item">
        Поставить на коня - <span className="font-weight-bold">200 DAI</span>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={() => buy_v2(ITEMS_V2[1])}
        >
          ID - {ITEMS_V2[1].id}
        </button>
      </li>
      <li className="list-group-item">
        Очистить - <span className="font-weight-bold">контракт</span>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={() => clear_contract()}
        >
          жмяк!
        </button>
      </li>
      <li className="list-group-item">
        GAME - <span className="font-weight-bold"></span>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={() => start()}
        >
          START
        </button>
      </li>
      <li className="list-group-item">
        <input value={amount} onChange={(e) => setAmountState(e.target.value)}/>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={() => send(123456789)}
        >
          123456789
        </button>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={() => send(987654321)}
        >
          987654321
        </button>
      </li>
      <li className="list-group-item">
        GAME - <span className="font-weight-bold"></span>
        <button
          type="button"
          className="btn btn-primary float-right"
          onClick={() => stop()}
        >
          STOP
        </button>
      </li>
    </ul>
  )
}

export default Store