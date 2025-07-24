const mongoose = require("mongoose");

const paymentPlanSchema = new mongoose.Schema({
    name: {
        type: String,
      },
      monthlyPrice: {
        type: Number,
      },
      annualPrice: {
        type: Number,
      },
})
const paymentPlan = mongoose.model(
    "paymentPlan",
    paymentPlanSchema
  );

module.exports = paymentPlan;