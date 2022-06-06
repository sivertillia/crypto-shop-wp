const express = require('express')
const { initOrder, getOrder, checkPayment } = require('./controller')


const router = new express.Router()

router
  .post('/init', initOrder)
  .get('/order', getOrder)
  .get('/payment', checkPayment)

module.exports = router