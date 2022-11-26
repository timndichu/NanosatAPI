const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const moment = require('moment');


const AccelerometerSchema = Schema({
    xAxis: {
        val: { type: Number },
        date: {
          type: String,
          default: () => moment().format("YYYY-MM-DD"),
        },
    
        time: {
          type: String,
          default: () => moment().format("HH:mm:ss"),
        },
      },
      yAxis: {
        val: { type: Number },
        date: {
          type: String,
          default: () => moment().format("YYYY-MM-DD"),
        },
    
        time: {
          type: String,
          default: () => moment().format("HH:mm:ss"),
        },
      },
      zAxis: {
        val: { type: Number },
        date: {
          type: String,
          default: () => moment().format("YYYY-MM-DD"),
        },
    
        time: {
          type: String,
          default: () => moment().format("HH:mm:ss"),
        },
      },

});







module.exports = mongoose.model("Accelerometer", AccelerometerSchema);
