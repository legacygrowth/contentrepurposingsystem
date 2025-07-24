const PaymentPlan = require("../models/paymentPlan");

const create = async (data) => {
  try {
    const newPlan = new PaymentPlan({
      name: data.name,
      monthlyPrice: data.monthlyPrice,
      annualPrice:data.annualPrice,
    });

    const created = await newPlan.save();
    return created;
  } catch (error) {
    console.error("Error creating payment plan:", error.message);
    return null;
  }
};

const getAll = async () => {
  try {
    return await PaymentPlan.find();
  } catch (error) {
    console.error("Error fetching payment plans:", error.message);
    return [];
  }
};

const getById = async (id) => {
  try {
    return await PaymentPlan.findById(id);
  } catch (error) {
    console.error("Error fetching payment plan by ID:", error.message);
    return null;
  }
};

const update = async (id, data) => {
  try {
    return await PaymentPlan.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    console.error("Error updating payment plan:", error.message);
    return null;
  }
};

const remove = async (id) => {
  try {
    return await PaymentPlan.findByIdAndDelete(id);
  } catch (error) {
    console.error("Error deleting payment plan:", error.message);
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
