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
            
          },
            mobileNo:mobileNo
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

let tokenAndSessionCreation = async(isUserExist,lastLoginTime,deviceInfo)=>{
  try {
    let userName =  decrypt(isUserExist.userName)
    let emailId
    let sessionId;
    
    if(isUserExist.emailId!=null){
      emailId =  decrypt(isUserExist.emailId)

    }
  
    let userId = isUserExist.userId
    let roleId = isUserExist.roleId
    console.log(isUserExist.userId,userName,emailId)

    console.log(userId,userName,emailId,roleId,'roleId')

    let accessAndRefreshToken = await generateToken(userId,userName,emailId,roleId)

    console.log(accessAndRefreshToken, "accessAndRefreshToken")
    if(accessAndRefreshToken?.error){
      return {
        error:accessAndRefreshToken.error
      }
    }
    let {accessToken,refreshToken} = accessAndRefreshToken;

    console.log(accessToken, refreshToken, 'accessToken and refresh token')
    const options = {
      httpOnly: true,
      secure: true
    };

    let updateLastLoginTime =  await user.update({lastLogin:lastLoginTime},{
      where :{
        userId:isUserExist.userId
      }
    })
    // check for active session

    let checkForActiveSession = await authSessions.findOne({where:{
    [Op.and] :[{userId:isUserExist.userId},
      {active:1}]
    }})
    // if active
    if(checkForActiveSession){

      let updateTheSessionToInactive = await authSessions.update({active:2},{
        where:{
          sessionId:checkForActiveSession.sessionId}
      })
      console.log('update the session To inactive', updateTheSessionToInactive)
        // after inactive
        if(updateTheSessionToInactive.length>0){
          // check if it is present in the device table or not
          let checkDeviceForParticularSession = await deviceLogin.findOne({
            where:{
              sessionId:checkForActiveSession.sessionId
            }
          })
          if(checkDeviceForParticularSession){
            if(checkDeviceForParticularSession.deviceName==deviceInfo.deviceName && checkDeviceForParticularSession.deviceType == deviceInfo.deviceType ){
              // insert to session table first 
              let insertToAuthSession = await authSessions.create({
                lastActivity:new Date(),
                active:1,
                deviceId:checkDeviceForParticularSession.deviceId,
                userId:isUserExist.userId
              })
              // then update the session id in the device table
              let updateTheDeviceTable = await deviceLogin.update({
                sessionId:insertToAuthSession.sessionId
              },{
                where:{
                  deviceId:checkDeviceForParticularSession.deviceId
                }
              })
              sessionId = insertToAuthSession.sessionId
            }
            else{
              // insert to device table 
              let insertToDeviceTable = await deviceLogin.create({
                deviceType:deviceInfo.deviceType,
                deviceName:deviceInfo.deviceName,
              
              })

              // Insert to session table
              let insertToAuthSession = await authSessions.create({
                lastActivity:new Date(),
                active:1,
                deviceId:insertToDeviceTable.deviceId,
                userId:isUserExist.userId
              })
              // update the session id in the device table
              let updateSessionIdInDeviceTable = await deviceLogin.update({
                sessionId:insertToAuthSession.sessionId
              },{
                where:{
                  deviceId:insertToDeviceTable.deviceId
                }
              })

              sessionId = insertToAuthSession.sessionId
            }
            console.log('session id ', sessionId)
          }
          else{
            console.log('session id2 ', sessionId)

              // insert to device table 
              let insertToDeviceTable = await deviceLogin.create({
                deviceType:deviceInfo.deviceType,
                deviceName:deviceInfo.deviceName,
              
              })

              // Insert to session table
              let insertToAuthSession = await authSessions.create({
                lastActivity:new Date(),
                active:1,
                deviceId:insertToDeviceTable.deviceId,
                userId:isUserExist.userId
              })
              // update the session id in the device table
              let updateSessionIdInDeviceTable = await deviceLogin.update({
                sessionId:insertToAuthSession.sessionId
              },{
                where:{
                  deviceId:insertToDeviceTable.deviceId
                }
              })
              sessionId = insertToAuthSession.sessionId

          }
          console.log('session 3',sessionId)
        }
        else{
          console.log('session 4',sessionId)

          return {
            error:'Something Went Wrong'
          }

        }
      
     
    }
    else{
        // insert to device table 
        let insertToDeviceTable = await deviceLogin.create({
          deviceType:deviceInfo.deviceType,
          deviceName:deviceInfo.deviceName,
        
        })

        // Insert to session table
        let insertToAuthSession = await authSessions.create({
          lastActivity:new Date(),
          active:1,
          deviceId:insertToDeviceTable.deviceId,
          userId:isUserExist.userId
        })
        // update the session id in the device table
        let updateSessionIdInDeviceTable = await deviceLogin.update({
          sessionId:insertToAuthSession.sessionId
        },{
          where:{
            deviceId:insertToDeviceTable.deviceId
          }
        })
        sessionId = insertToAuthSession.sessionId
    }
    console.log('session id5', encrypt(sessionId), sessionId)
    return {
      accessToken:accessToken,
      refreshToken:refreshToken,
      sessionId:encrypt(sessionId),
      options:options
    }

  } catch (err) {
    return {
      error:'Something Went Wrong'
    }
  }
}

let loginWithOTP = async (req, res) => {
  try {
      console.log('loginwithotp',req.body)
      let roleId = 4;
      let statusId = 1;
      let {encryptMobile:mobileNo,encryptOtp:otp}=req.body

      let userAgent =  req.headers['user-agent'];

      console.log('userAgent', userAgent)
      let deviceInfo = parseUserAgent(userAgent)
      let lastLoginTime = new Date();

      if (mobileNo && otp) {
        let isOtpValid = await otpVerifications.findOne({
          where:{
              expiryTime:{[Op.gte]:new Date()},
              code:otp,
              mobileNo:mobileNo
          }
        })
        console.log('207 line', isOtpValid)
        if(isOtpValid){
            let updateTheVerifiedValue = await otpVerifications.update({verified:1}
              ,{
                where:{
                  id:isOtpValid.id
                }
              }
            )
            console.log(updateTheVerifiedValue,'update the verified value')
             let isUserExist = await user.findOne({
              where:{
               [Op.and]:[{ phoneNo:mobileNo},{statusId:statusId},{roleId:roleId}]
              }
            })
            console.log(isUserExist,'check user 223 line')
          // If the user does not exist then we have to send a message to the frontend so that the sign up page will get render
          if(!isUserExist){
            return res.status(statusCode.SUCCESS.code).json({message:"please render the sign up page",decideSignUpOrLogin:0});  
          }
          
          console.log('2')
          let tokenGenerationAndSessionStatus = await tokenAndSessionCreation(isUserExist,lastLoginTime,deviceInfo);

          console.log('all the data', tokenGenerationAndSessionStatus)

          if(tokenGenerationAndSessionStatus?.error){

            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
              message:tokenAndSessionCreation.error
            })

          }

          console.log('here upto it is coming')
          let {accessToken, refreshToken, options,sessionId} = tokenGenerationAndSessionStatus

        
        // Set the access token in an HTTP-only cookie named 'accessToken'
        res.cookie('accessToken', accessToken,options);

        // Set the refresh token in a separate HTTP-only cookie named 'refreshToken'
        res.cookie('refreshToken', refreshToken, options)

        // bearer is actually set in the first to tell that  this token is used for the authentication purposes

        return res.status(statusCode.SUCCESS.code)
        .header('Authorization', `Bearer ${accessToken}`)
        .json({ message: "please render the login page", username: isUserExist.userName, fullname: isUserExist.fullName, email: isUserExist.emailId, role: isUserExist.roleId, accessToken: accessToken, refreshToken:refreshToken, decideSignUpOrLogin:1,sid:sessionId });

        }
        else{
          return res.status(statusCode.BAD_REQUEST.code).json({
            message:"Invalid Otp"
          })
        }
      }

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





function parseUserAgent(userAgent) {
  let deviceType = 'Unknown';
  let deviceName = 'Unknown Device';

  // Check if the User-Agent string contains patterns indicative of specific device types
  if (userAgent.includes('Windows')) {
      deviceType = 'Desktop';
      deviceName = 'Windows PC';
  } else if (userAgent.includes('Macintosh')) {
      deviceType = 'Desktop';
      deviceName = 'Mac';
  } else if (userAgent.includes('Linux')) {
      deviceType = 'Desktop';
      deviceName = 'Linux PC';
  } else if (userAgent.includes('Android')) {
      deviceType = 'Mobile';
      deviceName = 'Android Device';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')) {
      deviceType = 'Mobile';
      deviceName = 'iOS Device';
  }
    else if(userAgent.includes('Postman')){
      deviceType = 'PC'
      deviceName = 'Postman'
      
    }

  return { deviceType, deviceName };
}

module.exports = {
  createOtp,
  verifyOtp,
  loginWithOTP,
  loginWithOAuth,
  viewUserProfile,
  logout,
}

