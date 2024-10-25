const express = require('express');
const router = express.Router();
const api_version = process.env.API_VERSION
const authController = require('../../../../controllers/'+api_version+'/auth/user.controllers');
const refreshTokenController = require('../../../../controllers/'+api_version+'/auth/refreshToken.controllers');
let authenticateToken = require('../../../../middlewares/authToken.middlewares')

router.post('/createOtp', authController.createOtp);

router.post('/verifyOtp', authController.verifyOtp);

router.post('/loginWithOTP', authController.loginWithOTP);

router.post('/loginWithOAuth', authController.loginWithOAuth);

router.get('/viewUserProfile', authenticateToken, authController.viewUserProfile);

router.post('/logout', authenticateToken, authController.logout);

router.post('/signup', authController.signUp);

router.get('/initialData', authController.initialData);

router.post('/refresh-token', refreshTokenController.refresh);

router.put('/updateProfile', authenticateToken, authController.updateUserProfile);

router.post('/registerVolunteer', authenticateToken, authController.volunteerRegistration);

router.get('/viewVolunteerProfile', authenticateToken, authController.viewVolunteerProfileData);

module.exports = router