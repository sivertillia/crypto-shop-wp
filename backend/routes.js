const express = require('express')
const { getContract, initPayment } = require('./controller')


const router = new express.Router()

router
  .get('/getContract', getContract)
  .post('/init', initPayment)

module.exports = router