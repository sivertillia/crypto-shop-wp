const express = require('express')
const { getContract, initPayment, getCoin, checkPayment } = require('./controller')


const router = new express.Router()

router
  .get('/getContract', getContract)
  .post('/init', initPayment)
  .get('/coin', getCoin)
  .get('/payment', checkPayment)

module.exports = router