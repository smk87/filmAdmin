const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Depatment = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  positions: {
    type: [String],
    required: true
  },
  members: [
    {
      name: {
        type: String,
        required: true
      },
      position: {
        type: [String],
        required: true
      },
      experience: {
        type: [String]
      },
      imdb: {
        type: String
      },
      email: {
        type: String
      },
      phone: {
        type: String
      },
      skype: {
        type: String
      },
      facebook: {
        type: String
      },
      twitter: {
        type: String
      }
    }
  ]
});

module.exports = mongoose.model("departments", Depatment);
