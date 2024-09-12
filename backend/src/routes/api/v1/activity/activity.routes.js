const express = require('express');
const router = express.Router();
const api_version = process.env.API_VERSION
let authenticateToken = require('../../../../middlewares/authToken.middlewares')
let advertisementController = require('../../../../controllers/' + api_version + '/activity/advertisements.controllers')

router.post('/addNewAdvertisement', advertisementController.addNewAdvertisement);

router.get('/getAdvertisementList', advertisementController.getAdvertisementList);

module.exports = router;