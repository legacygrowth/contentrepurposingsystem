const agencyPaymentsModel = require("../models/agencyPayments");

const createAgencyPayment = async (data) => {
  return await agencyPaymentsModel.create(data);
};

const getAllAgencyPayments = async () => {
  return await agencyPaymentsModel.find().populate("agencyId");
};

const getAgencyPaymentById = async (id) => {
  return await agencyPaymentsModel.findById(id).populate("agencyId");
};

const updateAgencyPayment = async (id, data) => {
  return await agencyPaymentsModel.findByIdAndUpdate(id, data, { new: true });
};

const deleteAgencyPayment = async (id) => {
  return await agencyPaymentsModel.findByIdAndDelete(id);
};

module.exports = {
  createAgencyPayment,
  getAllAgencyPayments,
  getAgencyPaymentById,
  updateAgencyPayment,
  deleteAgencyPayment,
};
