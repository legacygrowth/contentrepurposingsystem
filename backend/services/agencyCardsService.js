const agencyCardsModel = require("../models/agencyCards");

const createAgencyCard = async (data) => {
  return await agencyCardsModel.create(data);
};

const getAllAgencyCards = async () => {
  return await agencyCardsModel.find().populate("agencyId");
};

const getAgencyCardById = async (id) => {
  return await agencyCardsModel.findById(id).populate("agencyId");
};

const updateAgencyCard = async (id, data) => {
  return await agencyCardsModel.findByIdAndUpdate(id, data, { new: true });
};

const deleteAgencyCard = async (id) => {
  return await agencyCardsModel.findByIdAndDelete(id);
};

module.exports = {
  createAgencyCard,
  getAllAgencyCards,
  getAgencyCardById,
  updateAgencyCard,
  deleteAgencyCard,
};
