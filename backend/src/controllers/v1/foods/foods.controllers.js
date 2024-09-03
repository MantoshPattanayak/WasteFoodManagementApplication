const db = require("../../../models");
const statusCode = require("../../../utils/statusCode");
const { foodListings, foodListingItems, entityTypes } = db;
const imageUpload = require("../../../utils/imageUpload");
const fetchMasterData = require("../../../utils/fetchMasterData");
const formatDateToDDMMYYYYHHMMSSMS = require("../../../utils/commonFunctions");

let addFoodDonationRequest = async (req, res) => {
    let transaction = await db.sequelize.transaction();
    try {
        let { foodItemsArray, receiverId } = req.body;
        let userId = req.user?.userId || 1;
        let subDir = '/foodDonation';
        //check if any detail is missing
        console.log("check submitted details start");
        for(let foodItem of foodItemsArray) {
            if(foodItem.foodName == undefined || !foodItem.foodName) {
                console.log("foodItem.foodName not provided");
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide all data."
                });
            }
            if(foodItem.foodCategory == undefined || !foodItem.foodCategory) {
                console.log("foodItem.foodCategory not provided");
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide all data."
                });
            }
            if(foodItem.quantity == undefined || !foodItem.quantity) {
                console.log("foodItem.quantity not provided");
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide all data."
                });
            }
            if(foodItem.unit == undefined || !foodItem.unit) {
                console.log("foodItem.unit not provided");
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide all data."
                });
            }
        }
        console.log("check submitted details end");
        // fetch entity types data
        let entityTypesMasterData = await fetchMasterData('entityTypes');
        console.log("entityTypesMasterData", entityTypesMasterData);
        entityTypesMasterData = entityTypesMasterData.filter((data) => { return data.entityTypeName == "foodDonation" });
        console.log("entityTypesMasterData filtered foodDonation", entityTypesMasterData);
        // insert into foodListing table
        let insertFoodListing = await foodListings.create({
            userId: userId,
            statusId: 1,
            receiverId: receiverId || null,
            createdBy: userId
        }, { transaction, returning: true });
        console.log("insertFoodListing", insertFoodListing);

        // insert into foodListingItems table
        let serialNumber = 0;
        console.log("insert into foodListingItems table start");
        for(let foodItem of foodItemsArray) {
            serialNumber += 1;
            let insertFoodListingItem = await foodListingItems.create({
                foodListingId: insertFoodListing.foodListingId,
                foodName: foodItem.foodName,
                foodCategory: foodItem.foodCategory,
                quantity: foodItem.quantity,
                unit: foodItem.unit,
                expirationDate: foodItem.expirationDate,
                statusId: 1
            }, { transaction, returning: true });

            let insertionData = {
                id: insertFoodListingItem.foodListingItemId,
                name: foodItem.foodName + "_" + foodItem.foodCategory + "_" + formatDateToDDMMYYYYHHMMSSMS()
            }
            // insert into food image file
            let imageFileUpload = imageUpload(foodItem.imageData, entityTypesMasterData[0].entityTypeName, subDir, insertionData, userId, errors, serialNumber, transaction);
            if(errors.length > 0) {
                transaction.rollback();
                return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                    message: "Error while submitting data."
                });
            }
        }
        console.log("insert into foodListingItems table end");
        serialNumber = 0;
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