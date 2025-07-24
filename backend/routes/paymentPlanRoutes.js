const express = require("express");
const router = express.Router();

const paymentPlanController = require("../controllers/paymentPlanController");

router.use("/", paymentPlanController);

module.exports = router;