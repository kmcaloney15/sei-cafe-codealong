const mongoose = require('mongoose')
const Schema = mongoose.Schema
// Require the itemSchema below
const itemSchema = require('./itemSchema');

// line items are embeded in orders since you will always need a order to have line items

const lineItemSchema = new Schema({
    // Set qty to 1 when new item pushed into lineItems
    qty: { type: Number, default: 1 },
    item: itemSchema
  }, {
    timestamps: true,
    // Add this to ensure virtuals are serialized
  toJSON: { virtuals: true }
  });

  // Simply put, Virtuals are computed properties that are not persisted in the document/database.
  // By default, a document's virtual properties are not included when the document is serialized, e.g., sent to the client using Express' res.json(personDoc).


  // Add an extPrice to the line item
lineItemSchema.virtual('extPrice').get(function () {
    // 'this' is bound to the lineItem subdocument
    return this.qty * this.item.price;
  });

  // Yes, we can dot into an embedded subdocument and access its properties as is being done with this.item.price.



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