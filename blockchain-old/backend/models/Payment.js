import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    id: String,
    itemId: String,
    paid: Boolean,
  })

export const Payment = mongoose.model('Payment', paymentSchema)