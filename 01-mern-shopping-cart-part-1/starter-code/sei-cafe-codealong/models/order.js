const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Require the itemSchema below
const itemSchema = require("./itemSchema");

// line items are embeded in orders since you will always need a order to have line items

const lineItemSchema = new Schema(
    {
        // Set qty to 1 when new item pushed into lineItems
        qty: { type: Number, default: 1 },
        item: itemSchema,
    },
    {
        timestamps: true,
        // Add this to ensure virtuals are serialized
        toJSON: { virtuals: true },
    }
    );
    
    const orderSchema = new Schema(
      {
        // An order belongs to a user
        user: { type: Schema.Types.ObjectId, ref: "User" },
        // Embed an order's line items is logical
        lineItems: [lineItemSchema],
        // A user's unpaid order is their "cart"
        isPaid: { type: Boolean, default: false },
      },
      {
        timestamps: true,
      }
    );
//Add the following helpful virtuals to order documents
orderSchema.virtual('orderTotal').get(function(){
    return this.lineItems.reduce((total, item) => total + item.extPrice, 0)
})

orderSchema.virtual('totalQty').get(function(){
    return this.lineItems.reduce((total, item) => total + item.qty, 0)
})

orderSchema.virtual('orderId').get(function(){
    return this.id.slice(-6).toUpperCase()
})


// statics are callable on the model, not an instance (document)
orderSchema.statics.getCart = function (userId) {
  // 'this' is bound to the model (don't use an arrow function)
  // return the promise that resolves to a cart (the user's unpaid order)
  return this.findOneAndUpdate(
    // query
    { user: userId, isPaid: false },
    // update - in the case the order (cart) is upserted
    { user: userId },
    // upsert option creates the doc if it doesn't exist!
    { upsert: true, new: true }
  );
};
// Simply put, Virtuals are computed properties that are not persisted in the document/database.
// By default, a document's virtual properties are not included when the document is serialized, e.g., sent to the client using Express' res.json(personDoc).
// Add an extPrice to the line item
lineItemSchema.virtual("extPrice").get(function () {
    // 'this' is bound to the lineItem subdocument
    return this.qty * this.item.price;
});

// Yes, we can dot into an embedded subdocument and access its properties as is being done with this.item.price.


module.exports = mongoose.model("Order", orderSchema);
