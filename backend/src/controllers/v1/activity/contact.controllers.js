const db = require("../../../models/index");
const { contactRequest, files, fileAttachments, sequelize } = db;
let statusCode = require("../../../utils/statusCode");
const imageUpload = require("../../../utils/imageUpload");
const { QueryTypes } = require("sequelize");
const logger = require('../../../logger/index.logger');

let contact = async (req, res) => {
    try {
        let { firstName, lastName, email, phoneNumber, message } = req.body;
        console.log({ firstName, lastName, email, phoneNumber, message })
        let missingInfo = [];
        if(!firstName)
            missingInfo.push('First Name');
        if(!email || !phoneNumber)
            missingInfo.push('Email/Phone Number');
        if(!message)
            missingInfo.push('Message');

        if(missingInfo.length > 0) {
            return res.status(statusCode.BAD_REQUEST.code).json({
                message: `Please provide the following data: ${missingInfo.toString()}.`
            })
        }
        // insert data
        let insertContactInfo = await contactRequest.create({
            firstName, 
            lastName, 
            email, 
            phoneNumber, 
            message, 
            statusId: 1,
        });

        if(insertContactInfo) {
            return res.status(statusCode.CREATED.code).json({
                message: "Your message is received. Thanks for reaching out!"
            })
        }
        else {
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: "Something went wrong!"
            })
        }
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
    contact
}