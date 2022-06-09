const express = require('express')
const { initOrder, getOrder, checkPayment, getData } = require('./controller')


const router = new express.Router()

router
  .post('/init', initOrder)
  .get('/order', getOrder)
  .get('/payment', checkPayment)
  .get('/test', getData)


module.exports = router