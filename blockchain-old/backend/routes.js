import { Router } from 'express'
import { getItemUrl, getPaymentId } from './controllers/index.js'

const router = new Router()

router
  .get('/getPaymentId/:id', getPaymentId)
  .get('/getItemUrl/:id', getItemUrl)

export default router