const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const moment = require('moment');


const UserSchema = Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userCreatedOn: {
    type: String,
    default: () => moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
  }

});







module.exports = mongoose.model("User", UserSchema);
