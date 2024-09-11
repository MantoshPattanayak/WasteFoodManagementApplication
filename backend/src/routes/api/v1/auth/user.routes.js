const express = require('express');
const router = express.Router();
const api_version = process.env.API_VERSION
const authController = require('../../../../controllers/'+api_version+'/auth/user.controllers');
let authenticateToken = require('../../../../middlewares/authToken.middlewares')

router.post('/createOtp', authController.createOtp);

router.post('/verifyOtp', authController.verifyOtp);

router.post('/loginWithOTP', authController.loginWithOTP);

router.post('/loginWithOAuth', authController.loginWithOAuth);

router.get('/viewUserProfile', authenticateToken, authController.viewUserProfile);

router.post('/logout', authenticateToken, authController.logout);

router.post('/signup', authenticateToken, authController.signUp);

router.get('/initialData', authController.initialData);

module.exports = router