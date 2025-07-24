const express = require("express");
const router = express.Router();

const paymentPlanService = require("../services/paymentPlanService");
const planDetailsService = require("../services/planDetailsService");
const agencyPaymentPlanService = require("../services/agencyPaymentPlanService");
const agencyModel = require("../models/agencyModel");

router.post("/InsertPaymentPlan", async (req, res) => {
    try {
      const { name, monthlyPrice, postingCount, workspaceCount, userCount, description, annualPrice, daysLimitations } = req.body;
  
      const plan = await paymentPlanService.create({ name, monthlyPrice,
        annualPrice, });
  
      const details = await planDetailsService.create({
        paymentPlanId: plan._id,
        postingCount,
        workspaceCount,
        userCount,
        description,
        daysLimitations,
      });
  
      return res.status(201).json({
        message: "PaymentPlan and PlanDetails inserted successfully",
        plan,
        details,
      });
    } catch (error) {
      console.error("InsertPaymentPlan error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  });
  
  
  router.get("/GetAllPaymentDetails", async (req, res) => {
    try {
      const plans = await paymentPlanService.getAll();
      const details = await planDetailsService.getAll();

      const combined = plans.map((plan) => {
        const detail = details.find(
          (d) => d.paymentPlanId?.toString() === plan._id.toString()
        );
        return {
          ...plan.toObject(),
          details: detail || null,
        };
      });

      return res.status(200).json({
        message: "All payment plans and details fetched",
        plans:combined,
      });
    } catch (error) {
      console.error("GetAllPaymentDetails error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  });
  
  
  router.post("/InsertAgencyPaymentPlan", async (req, res) => {
    try {
      const { agencyId, paymentPlanId } = req.body;
  
      const agencyPlan = await agencyPaymentPlanService.create({
        agencyId,
        paymentPlanId,
      });
  
      await agencyModel.findByIdAndUpdate(agencyId, {
        isPaymentVerified: true,
      });
  
      return res.status(201).json({
        message: "agency payment plan inserted successfully",
        agencyPlan,
      });
    } catch (error) {
      console.error("InsertAgencyPaymentPlan error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  });
  
  module.exports = router;