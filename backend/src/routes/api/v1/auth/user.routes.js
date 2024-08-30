const express = require('express');
const router = express.Router();
const api_version = process.env.API_VERSION
const authController = require('../../../../controllers/'+api_version+'/auth/user.controllers');
let authenticateToken = require('../../../../middlewares/authToken.middlewares')

router.post('/createOtp', authenticateToken, authController.createOtp);

router.post('/verifyOtp', authenticateToken, authController.verifyOtp);

router.post('/loginWithOTP', authenticateToken, authController.loginWithOTP);

router.post('/loginWithOAuth', authenticateToken, authController.loginWithOAuth);

router.get('/viewUserProfile', authenticateToken, authController.viewUserProfile);

router.post('/logout', authenticateToken, authController.logout);

module.exports = router