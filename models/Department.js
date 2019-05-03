const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Depatment = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  positions: [
    {
      type: Schema.Types.ObjectId,
      ref: "positions"
    }
  ]
});

module.exports = mongoose.model("departments", Depatment);
