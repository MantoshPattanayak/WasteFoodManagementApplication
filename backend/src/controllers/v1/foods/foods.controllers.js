const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const { foodCategories, foodListings, foodListingItems, files, fileAttachments } = db.foodCategories;
const imageUpload = require("../../../utils/imageUpload");

let addFoodDonationRequest = async (req, res) => {
    let transaction = await db.sequelize.transaction();
    try {
        let { foodItemsArray, receiverId } = req.body;
        let userId = req.user?.userId || 1;
        //check if any detail is missing
        for(let foodItem of foodItemsArray) {
            if(foodItem.foodName == undefined || !foodItem.foodName) {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide all data."
                });
            }
            if(foodItem.foodCategory == undefined || !foodItem.foodCategory) {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide all data."
                });
            }
            if(foodItem.quantity == undefined || !foodItem.quantity) {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide all data."
                });
            }
            if(foodItem.unit == undefined || !foodItem.unit) {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide all data."
                });
            }
        }

        // insert into foodListing table
        let insertFoodListing = await foodListings.create({
            userId: userId,
            statusId: 1,
            receiverId: receiverId || null,
            createdBy: userId
        }, { transaction, returning: true });

        // insert into foodListingItems table
        for(let foodItem of foodItemsArray) {
            let insertFoodListingItem = await foodListingItems.create({
                foodListingId: insertFoodListing.foodListingId,
                foodName: foodItem.foodName,
                foodCategory: foodItem.foodCategory,
                quantity: foodItem.quantity,
                unit: foodItem.unit,
                expirationDate: foodItem.expirationDate,
                statusId: 1
            }, { transaction, returning: true });

            // insert into food image file
        }

        transaction.commit();
        return res.status(statusCode.CREATED.code).json({
            message: "New food donation has been posted."
        })
    }
    catch (error) {
        transaction.rollback();
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let viewFoodDonationList = async (req, res) => {
    try {

    }
    catch (error) {

    }
}

let viewFoodDonationById = async (req, res) => {
    try {

    }
    catch (error) {

    }
}

let acceptFoodDonation = async (req, res) => {
    try {

    }
    catch (error) {

    }
}

let viewFoodPickupList = async (req, res) => {
    try {

    }
    catch (error) {

    }
}

let viewFoodPickupById = async (req, res) => {
    try {

    }
    catch (error) {

    }
}

module.exports = {
    addFoodDonationRequest,
    viewFoodDonationList,
    viewFoodDonationById,
    acceptFoodDonation,
    viewFoodPickupList,
    viewFoodPickupById
}