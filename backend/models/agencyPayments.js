const mongoose = require("mongoose");
const agency = require("../models/agencyModel");

const agencyPaymentsSchema = new mongoose.Schema({
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agency",
      },
      amount: {
        type: String,
      },
      paymentDate: {
        type: Date,
      },
      paymentGateway: {
        type: String,
      },
      gatewayResponse: {
        type: String,
      },
});

module.exports = mongoose.model("agencyPayments", agencyPaymentsSchema, "agencyPayments");