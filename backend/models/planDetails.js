const mongoose = require("mongoose");
require('../models/paymentPlan');


const planDetailsSchema = new mongoose.Schema({
    postingCount:{
        type: Number,
    },
    workspaceCount:{
        type: Number,
    },
    userCount:{
        type: Number,
    },
    description:{
        type: String,
    },
    paymentPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "paymentPlan",
    },
    daysLimitations: {
        type: Number
    },
})
const planDetails = mongoose.model(
    "planDetails",
    planDetailsSchema
  );

module.exports = planDetails;