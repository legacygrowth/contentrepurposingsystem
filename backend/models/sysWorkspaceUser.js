const mongoose = require('mongoose');

const sysWorkspaceUser = new mongoose.Schema({
  workspaceId: {
        type: mongoose.Schema.Types.ObjectId,  // 👈 Refers to ObjectId
        ref: 'Workspace'                            // 👈 Name of the model being referenced
      },
      
  userId: {
        type: mongoose.Schema.Types.ObjectId,  // 👈 Refers to ObjectId
        ref: 'sysUser'                            // 👈 Name of the model being referenced
      },
 isPrimary:{
    type:Boolean
  },

});

module.exports = mongoose.model('sysWorkspaceUser', sysWorkspaceUser, 'sysWorkspaceUser');