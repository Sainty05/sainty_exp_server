const mongoose = require('mongoose')

const ExpenceSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    catagory: { type: String, required: true },
    amount: { type: Number, required: true },
    discription: { type: String, required: false },
    amountType: { type: String, required: true }
}, { timestamps: true })

const Expence = mongoose.model('Expence', ExpenceSchema)

module.exports = Expence

