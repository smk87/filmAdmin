const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Crew = new Schema({
  name: {
    type: String,
    required: true
  },
  experience: {
    type: String
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
});

module.exports = mongoose.model("crews", Crew);
