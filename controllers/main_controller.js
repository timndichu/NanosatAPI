//Import models if any
const Temperature = require("../models/temperature");
const Accelerometer = require("../models/accelerometer");
const Gyroscope = require("../models/gyroscope");

// OBC
const ObcCurrent = require("../models/obcCurrent");
const ObcTemp = require("../models/obcTemp");
const ObcVoltage = require("../models/obcVoltage");
// EPS
const EpsCurrent = require("../models/epsCurrent");
const EpsPower = require("../models/epsPower");
const EpsVoltage = require("../models/epsVoltage");

const csv = require("fast-csv");

const https = require("https");
const ITEMS_PER_PAGE = 20;

exports.testCSV =  (req, res, next) => {
  const file = req.file;
  console.log(file);
  if (req.file == undefined) {
    return res.status(500).json({ message: "Please upload a CSV file!" });
  }
  else {
    return res.status(200).json({ message: "Success" });
  }
}



exports.uploadCSV = async (req, res, next) => {
  
  try {
    if (req.file == undefined) {
      return res.status(500).json({ message: "Please upload a CSV file!" });
    }
    let rows = [];
  
    let hasError = false;

    https.get(req.file.location, (stream) => {
      stream.pipe(
        csv
          .parse({
            headers: [
              "Acc_X",
              "Acc_Y",
              "Acc_Z",
              "Temp",
              "Gyro_X",
              "Gyro_Y",
              "Gyro_Z",
              "Time"
            ],

            strictColumnHandling: true,
          })
          .on("error", (e) => {
            console.error(e);
            hasError = true;
            return res.status(501).json({
              message:
                "Invalid file format. Please make sure your csv headers match the format defined above 1",
              error: e,
            });
          })
          .on("data", (row) => {
             rows.push(row);
             console.log(rows);
             
          })
          .on("data-invalid", (row, rowNumber) => {
            hasError = true;
            console.log(
              `Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}]`
            );
          })

          .on("end", () => {
            console.log("stream over");
            //TODO push rows to DB

            return res.status(200).json({
              message: "Success ",
              rows: rows
            });
          })
      );
    });
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};


exports.getTempReadings = (req,res,next)=> {
  Temperature.find()
  .sort({_id: -1})
  .limit(ITEMS_PER_PAGE)
  .then((docs) => {
    return res.status(200).json({ docs: docs });
  })
  .catch((err) => {
    return res.status(500).json({ msg: "Failed", err: err });
  });
}

exports.getAccReadings = (req,res,next)=> {
  Accelerometer.find()
  .sort({_id: -1})
  .limit(ITEMS_PER_PAGE)
  .then((docs) => {
    return res.status(200).json({ docs: docs });
  })
  .catch((err) => {
    return res.status(500).json({ msg: "Failed", err: err });
  });

}

exports.getGyroReadings = (req,res,next)=> {
  Gyroscope.find()
  .sort({_id: -1})
  .limit(ITEMS_PER_PAGE)
  .then((docs) => {
    return res.status(200).json({ docs: docs });
  })
  .catch((err) => {
    return res.status(500).json({ msg: "Failed", err: err });
  });

}

exports.postReadings = (req, res) => {
  let body = req.body;
  let data = body["data"];
    console.log(data);
    if(data[0]=="A") {
      // post accelerometer readings
      // split into X,Y,Z
      const arr = data.split(",");
      const acc_x = Number(arr[1]);
      const acc_y = Number(arr[2]);
      const acc_z = Number(arr[3]);

      const acc = new Accelerometer({
       xAxis : {
        val: acc_x
       },
       yAxis : {
        val: acc_y
       },
       zAxis : {
        val: acc_z
       },

      });
      acc
      .save()
      .then((result) => {
        console.log(result);
        return res.status(200).json({ message: "Success" });
      })
      .catch((err) => { 
        return res.status(500).json({ err: err });
      })
    }
    else  if(data[0]=="T") {
      // post Temp readings
         // split into Temp value
         const arr = data.split(",");
         const temp = Number(arr[1]);
         const temperature = new Temperature({
          temp : temp
          
         });
         temperature
         .save()
         .then((result) => {
           console.log(result);
           return res.status(200).json({ message: "Success" });
         })
         .catch((err) => { 
           return res.status(500).json({ err: err });
         })
    }
    else  if(data[0]=="G") {
      // post Gyro readings
         // split into X,Y,Z
         const arr = data.split(",");
         const gyro_x = Number(arr[1]);
         const gyro_y = Number(arr[2]);
         const gyro_z = Number(arr[3]);

         const gyro = new Gyroscope({
          xAxis : {
           val: gyro_x
          },
          yAxis : {
           val: gyro_y
          },
          zAxis : {
           val: gyro_z
          },
   
         });
         gyro
         .save()
         .then((result) => {
           console.log(result);
           return res.status(200).json({ message: "Success" });
         })
         .catch((err) => { 
           return res.status(500).json({ err: err });
         })
    }

    // else  if(data[0]=="OC") {
    //   const arr = data.split(",");
    //   arr.pop();
    //   let finalArr = arr;
    //   finalArr.shift();
    //   let currents = [];

    //   for (let i = 0; i < finalArr.length; i++) {
    //    currents.concat(Number(finalArr[i]));
    //   }

    //   const obcCurr = new ObcCurrent({
    //     current : currents
        
    //    });
    //    obcCurr
    //    .save()
    //    .then((result) => {
    //      console.log(result);
    //      return res.status(200).json({ message: "Success" });
    //    })
    //    .catch((err) => { 
    //      return res.status(500).json({ err: err });
    //    })
    // }

    // else  if(data[0]=="OL") {
    //   const arr = data.split(",");
    //   arr.pop();
    //   let finalArr = arr;
    //   finalArr.shift();
    //   let voltages = [];

    //   for (let i = 0; i < finalArr.length; i++) {
    //     voltages.concat(Number(finalArr[i]));
    //   }

    //   const obcVoltage = new ObcVoltage({
    //     voltage : voltages
        
    //    });
    //    obcVoltage
    //    .save()
    //    .then((result) => {
    //      console.log(result);
    //      return res.status(200).json({ message: "Success" });
    //    })
    //    .catch((err) => { 
    //      return res.status(500).json({ err: err });
    //    })
    // }

    // else  if(data[0]=="OT") {
    //   const arr = data.split(",");
    //   arr.pop();
    //   let finalArr = arr;
    //   finalArr.shift();
    //   let temps = [];

    //   for (let i = 0; i < finalArr.length; i++) {
    //     temps.concat(Number(finalArr[i]));
    //   }

    //   const obcTemp = new ObcTemp({
    //     temp : temps
        
    //    });
    //    obcTemp
    //    .save()
    //    .then((result) => {
    //      console.log(result);
    //      return res.status(200).json({ message: "Success" });
    //    })
    //    .catch((err) => { 
    //      return res.status(500).json({ err: err });
    //    })
    // }



 };






