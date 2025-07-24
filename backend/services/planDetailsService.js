const PlanDetails = require("../models/planDetails");

const create = async (data) => {
  try {
    const newDetails = new PlanDetails({
      postingCount: data.postingCount,
      workspaceCount: data.workspaceCount,
      userCount: data.userCount,
      description: data.description,
      daysLimitations:data.daysLimitations,
      paymentPlanId:data.paymentPlanId,
    });

    const created = await newDetails.save();
    return created;
  } catch (error) {
    console.error("Error creating plan details:", error.message);
    return null;
  }
};

const getAll = async () => {
  try {
    return await PlanDetails.find();
  } catch (error) {
    console.error("Error fetching plan details:", error.message);
    return [];
  }
};

const getById = async (id) => {
  try {
    return await PlanDetails.findById(id);
  } catch (error) {
    console.error("Error fetching plan detail by ID:", error.message);
    return null;
  }
};

const update = async (id, data) => {
  try {
    return await PlanDetails.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    console.error("Error updating plan detail:", error.message);
    return null;
  }
};

const remove = async (id) => {
  try {
    return await PlanDetails.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting plan detail:", error.message);
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
