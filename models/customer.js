const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  gender: String,
  dressType: String,
  measurements: {
    chest: String,
    waist: String,
    hip: String,
    shoulder: String,
    length: String
  },
  payment: {
    totalAmount: Number,
    amountPaid: Number,
    deliveryDate: String
  }
});

module.exports = mongoose.model('Customer', customerSchema);
