const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const moment = require('moment');


const ObcCurrentSchema = Schema({
    current: {
        type: [Number]
              
      },
      date: {
        type: String,
        default: () => moment().format("YYYY-MM-DD"),
      },
  
      time: {
        type: String,
        default: () => moment().format("HH:mm:ss"),
      },

});


module.exports = mongoose.model("ObcCurrent", ObcCurrentSchema);
