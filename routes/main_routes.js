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

router.get('/getLightStatus', controller.getLightStatus);








/**
 * Module exports are the instruction that tells Node. js which bits of code (functions, objects, strings, etc.) 
 * to “export” from a given file so other files are allowed to access the exported code.
 */
module.exports = router;