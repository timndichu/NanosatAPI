const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const moment = require('moment');


const ObcTempSchema = Schema({
    temp: {
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


module.exports = mongoose.model("ObcTemp", ObcTempSchema);
