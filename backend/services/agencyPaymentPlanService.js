const agencyPaymentPlan = require("../models/agencyPaymentPlan");

const create = async (data) => {
  try {
    const newAgencyPlan = new agencyPaymentPlan({
      agencyId: data.agencyId,
      paymentPlanId: data.paymentPlanId,
      paymentDate: data.paymentDate,
    });

    const created = await newAgencyPlan.save();
    return created;
  } catch (error) {
    console.error("Error creating agency payment plan:", error.message);
    return null;
  }
};

const getAll = async () => {
  try {
    return await agencyPaymentPlan.find()
      .populate("agencyId")
      .populate("paymentPlanId")
      .populate("paymentDate");
  } catch (error) {
    console.error("Error fetching agency payment plans:", error.message);
    return [];
  }
};

const getById = async (id) => {
  try {
    return await agencyPaymentPlan.findById(id)
    .populate("agencyId")
    .populate("paymentPlanId")
    .populate("paymentDate");
  } catch (error) {
    console.error("Error fetching aency payment plan by ID:", error.message);
    return null;
  }
};

const update = async (id, data) => {
  try {
    return await agencyPaymentPlan.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    console.error("Error updating agency payment plan:", error.message);
    return null;
  }
};

const remove = async (id) => {
  try {
    return await agencyPaymentPlan.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting agency payment plan:", error.message);
    return null;
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};
