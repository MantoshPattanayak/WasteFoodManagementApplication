const express = require('express');
const router = express.Router();
const api_version = process.env.API_VERSION
const foodsController = require('../../../../controllers/'+api_version+'/foods/foods.controllers');
let authenticateToken = require('../../../../middlewares/authToken.middlewares')

router.post("/addFoodDonationRequest", authenticateToken, foodsController.addFoodDonationRequest);

router.post("/viewFoodDonationList", authenticateToken, foodsController.viewFoodDonationList);

router.get("/viewFoodDonationById/:id", authenticateToken, foods.viewFoodDonationById);

router.put("/acceptFoodDonation", authenticateToken, foodsController.acceptFoodDonation);

router.post("/viewFoodPickupList", authenticateToken, foodsController.viewFoodPickupList);

router.get("/viewFoodPickupById/:id", authenticateToken, foodsController.viewFoodPickupById);

module.exports = router;