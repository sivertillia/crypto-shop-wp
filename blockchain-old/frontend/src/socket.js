import { io } from 'socket.io-client'

let socket

export const connect = (url, cb) => {
  socket = io(url)
  cb()
}

export const getPaymentDoneSocket = (cb) => {
  socket.on('payment:done', (payer, amount, paymentId, date) => {
    cb({payer, amount, paymentId, date})
  })
}