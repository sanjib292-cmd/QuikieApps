const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
    user_from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    user_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    is_accepted: {
        type: Boolean,
        default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  });

  module.exports.FriendModel = mongoose.model('FrienList', friendSchema);