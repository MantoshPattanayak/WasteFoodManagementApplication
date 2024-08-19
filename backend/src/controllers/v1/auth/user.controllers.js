const db = require("../../../models/index");
let statusCode = require("../../../utils/statusCode");
const bcrypt = require("bcrypt");
const fs = require('fs')
let deviceLogin = db.device
let otpCheck = db.otpDetails
let QueryTypes = db.QueryTypes
const { sequelize,Sequelize } = require('../../../models')
let jwt = require('jsonwebtoken');

const {encrypt} = require('../../../middlewares/encryption.middlewares')
const {decrypt} = require('../../../middlewares/decryption.middlewares')
const { Op } = require("sequelize");


let signUp = async (req,res)=>{
  let transaction;
 try{
 
    //   if(newUser){
    //     await transaction.commit();
    //     return res.status(statusCode.SUCCESS.code).json({
    //     message:"User created successfully", user: newUser 
    //   })
    //   }
    //   else{
    //      await transaction.rollback();
    //     return res.status(statusCode.BAD_REQUEST.code).json({
    //       message:`Data is not updated`
    //     })
    //   }
  } catch (err) {
    // Handle errors
    // if(transaction) await transaction.rollback();
    // return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
    //   message:err.message
    // })
  }
};

let publicLogin = async(req,res)=>{

  try{
    
  
   }
  catch(err){
    return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
      message:err.message
    })
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
     let updateTheSessionToInactive = await authSessions.update({active:2},{
      where:{
        sessionId:sessionId}
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
 publicLogin,
 signUp,
 logout
}

