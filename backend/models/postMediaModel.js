const mongoose = require('mongoose');

const postMediaSchema = new mongoose.Schema({
  postId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
    required: true,
  },
  socialMedia:{
    type: Object,
    required: true,
  },
  files: [
    {
      url: Object,
      type: Object,
      mimetype: Object,
      filename: Object,
    }
  ],
});

module.exports = mongoose.model('postMedia', postMediaSchema, 'postMedia');
