const express = require('express')
const { getContract, initPayment, getOrder, checkPayment } = require('./controller')


const router = new express.Router()

router
  .post('/init', initPayment)
  .get('/order', getOrder)
  .get('/payment', checkPayment)

module.exports = router