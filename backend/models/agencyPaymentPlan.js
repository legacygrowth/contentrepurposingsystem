const mongoose = require("mongoose");
const { payment } = require("paypal-rest-sdk");
require("./agencyModel");
require("./paymentPlan");

const agencyPaymentPlanSchema = new mongoose.Schema({
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "agency",
  },
  paymentPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "paymentPlan",
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentType: {
    type:String,
  },
});
const agencyPaymentPlan = mongoose.model(
  "agencyPaymentPlan",
  agencyPaymentPlanSchema
);

module.exports = agencyPaymentPlan;
