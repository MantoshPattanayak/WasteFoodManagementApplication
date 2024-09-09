const db = require("../../../models/index");
let statusCode = require("../../../utils/statusCode");
const bcrypt = require("bcrypt");
const fs = require('fs')
let deviceLogin = db.device
let otp
let otpVerifications = db.otpVerifications
let QueryTypes = db.QueryTypes
const { sequelize, Sequelize } = require('../../../models')
let jwt = require('jsonwebtoken');
const { encrypt } = require('../../../middlewares/encryption.middlewares')
const { decrypt } = require('../../../middlewares/decryption.middlewares')
const { Op } = require("sequelize");
let generateToken = require('../../../utils/generateToken');

function generateRandomOTP(numberValue = "1234567890", otpLength = 6) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += numberValue.charAt(Math.floor(Math.random() * otpLength));
  }
  return result;
}

let createOtp = async (req, res) => {
  try {
    let { encryptMobile: mobileNo } = req.body;
    console.log("encrypted mobile number", mobileNo);
    const generatedOTP = generateRandomOTP();
    console.log("generated OTP", generatedOTP);
    mobileNo = decrypt(mobileNo.toString()); //get the decrypted mobile number
    console.log("decrypted mobile number", mobileNo);
    let expiryTime = new Date();
    expiryTime = expiryTime.setMinutes(expiryTime.getMinutes() + 1);
    let otp = "123456";

    if (mobileNo) { // if proper mobile number
      let isOtpValid = await otpVerifications.findOne({
        where: {
          expiryTime: {
            [Op.gte]: new Date(),
            mobileNo
          }
        }
      });
      if (isOtpValid) { // if otp present, then expire the otp
        let expireOtp = await otpVerifications.update({
          expiryTime: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }, {
          where: {
            mobileNo: mobileNo
          }
        });

        if (expireOtp.length > 0) {
          return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message:"Something went wrong"
          })
        }
      }
    }

    return res.status(statusCode.SUCCESS.code).json({
      message: "OTP sent successfully. OTP is valid for 1 minute.",
      otp: generateRandomOTP,
    });
  }
  catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: error.message
    })
  }
}

let verifyOtp = async (req, res) => {
  try {
    let { encryptMobile: mobileNo, isOTPVerified } = req.body;
    console.log("req body params", { mobileNo, isOTPVerified });

  }
  catch (error) {

  }
}

let loginWithOTP = async (req, res) => {
  try {


  }
  catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message: err.message
    })
  }
}

let loginWithOAuth = async (req, res) => {
  try {

  }
  catch (error) {

  }
}

let viewUserProfile = async (req, res) => {
  try {

  }
  catch (error) {

  }
}

let logout = async (req, res) => {
  try {
    let userId = req.user?.userId || 1;
    let sessionId = decrypt(req.session)
    const options = {
      expires: new Date(Date.now() - 1), // Expire the cookie immediately
      httpOnly: true,
      secure: true
    };
    let updateTheSessionToInactive = await authSessions.update({ active: 2 }, {
      where: {
        sessionId: sessionId
      }
    })
    // Clear both access token and refresh token cookies
    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);

    res.status(statusCode.SUCCESS.code).json({ message: 'Logged out successfully', sessionExpired: true });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({ message: err.message, sessionExpired: true });

  }
}


module.exports = {
  createOtp,
  verifyOtp,
  loginWithOTP,
  loginWithOAuth,
  viewUserProfile,
  logout,
}

