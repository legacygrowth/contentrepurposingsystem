const mongoose = require("mongoose");
const agency = require("../models/agencyModel");

const agencyCardsSchema = new mongoose.Schema({
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "agency",
      },
      cardLast4: {
        type: Number,
      },
      cardIdOnGateway: {
        type: String,
      },
      customerIdOnGateway: {
        type: String,
      },
      isPrimary: {
        type: Boolean,
      },
});

module.exports = mongoose.model("agencyCards", agencyCardsSchema, "agencyCards");