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
      type: Schema.Types.ObjectId,
      ref: "crews"
    }
  ]
});

module.exports = mongoose.model("departments", Depatment);
