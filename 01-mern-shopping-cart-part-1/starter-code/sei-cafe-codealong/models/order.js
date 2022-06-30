const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    // An order belongs to a user
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    // Embed an order's line items is logical
    lineItems: [lineItemSchema],
    // A user's unpaid order is their "cart"
    isPaid: { type: Boolean, default: false},

}, {
    timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)