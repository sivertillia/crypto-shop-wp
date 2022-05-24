import { Payment } from '../models/Payment.js'


const items = {
  '1': { id: 1, url: 'http://UrlToDownloadItem1' },
  '2': { id: 2, url: 'http://UrlToDownloadItem2' },
}

export const getPaymentId = async (req, res) => {
  const { id } = req.params
  const paymentId = (Math.random() * 10000).toFixed(0)
  await Payment.create({
    id: paymentId,
    itemId: id,
    paid: false,
  })
  res.json({ paymentId: paymentId })
}

export const getItemUrl = async (req, res) => {
  const { id } = req.params
  const payment = await Payment.findOne({ id: id })
  if (payment && payment.paid) {
    return res.json({ url: items[payment.itemId].url })
  } else res.status(400).json({ url: '' })
}