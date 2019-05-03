const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Position = new Schema({
  title: {
    type: String,
    required: true
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "crews"
    }
  ]
});

module.exports = mongoose.model("positions", Position);
