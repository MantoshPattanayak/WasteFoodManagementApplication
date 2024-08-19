const express = require('express');
const router = express.Router();

const api_version = process.env.API_VERSION
const authController = require('../../../../controllers/'+api_version+'/auth/user.controllers');
let authenticateToken = require('../../../../middlewares/authToken.middlewares')


router.post('/signup',authController.signUp);

router.post('/publicLogin',authController.publicLogin);

router.post('/logout',authenticateToken, authController.logout);


module.exports = router