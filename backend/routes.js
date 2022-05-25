const express = require('express')
const { getContract } = require('./controller')


const router = new express.Router()

router
  .get('/getContract', getContract)

module.exports = router