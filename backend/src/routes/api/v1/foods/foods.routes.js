const express = require('express');
const router = express.Router();
const api_version = process.env.API_VERSION
const foodsController = require('../../../../controllers/'+api_version+'/foods/foods.controllers');
let authenticateToken = require('../../../../middlewares/authToken.middlewares')

router.post("/addFoodDonationRequest", foodsController.addFoodDonationRequest);

router.post("/viewFoodDonationList", foodsController.viewFoodDonationList);

router.get("/viewFoodDonationById/:id", foodsController.viewFoodDonationById);

router.put("/acceptFoodDonation", foodsController.acceptFoodDonation);

router.put("/closeFoodDonation", foodsController.closeFoodDonation);

router.post("/viewFoodPickupList", foodsController.viewFoodPickupList);

router.get("/viewFoodPickupById/:id", foodsController.viewFoodPickupById);

module.exports = router;