const mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userName: String,
    lastName: String,
    password: String,
    age: Number,
    city: String,
});

var CustomerModel = mongoose.model("Customer", customerSchema);

module.exports = CustomerModel;