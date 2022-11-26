//This is where we will do our routing
//These are the routes/endpoints that our clients will be sending data to

//We always have to initialize our express framework as it has the utility functions we need
const express = require('express');

/**
 *express.Router() is a class which helps us to create router handlers. 
 *By router handler I mean to not just providing routing to our app but,
  also can extend this routing to handle validation, handle 404 or other errors etc.
 */
const router = express.Router();

const controller = require('../controllers/main_controller');
const userController = require('../controllers/user_controller');


const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

aws.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: "us-east-2",
  signatureVersion: "v4",
});

// const { S3Client } = require('@aws-sdk/client-s3');
// const s3 = new S3Client();
var s3 = new aws.S3({});

// UPLOAD USERS CSV
var uploadCSV = multer({
  limits: {
    fileSize: 10485760, // 10MB
  },
  storage: multerS3({
    s3: s3,
    bucket: "ndichu-storage",
    
    key: function (req, file, cb) {

      cb(
        null,
        "csv/" +
          new Date().toISOString().replace(/:/g, "-") +
          "-" +
          file.originalname
      );
    },
  }),
});










router.get('/getTempReadings', controller.getTempReadings);
router.get('/getAccReadings', controller.getAccReadings);
router.get('/getGyroReadings', controller.getGyroReadings);

router.post('/postReadings', controller.postReadings);


// router.post('/uploadCSV',uploadCSV.single("csvFile"), controller.testCSV);
router.post('/uploadCSV',uploadCSV.single("csvFile"), controller.uploadCSV);

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/getAllUsers', userController.getAllUsers);

/**
 * Module exports are the instruction that tells Node. js which bits of code (functions, objects, strings, etc.) 
 * to “export” from a given file so other files are allowed to access the exported code.
 */
module.exports = router;