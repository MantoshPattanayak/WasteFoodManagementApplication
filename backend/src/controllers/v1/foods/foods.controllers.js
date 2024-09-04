const db = require("../../../models");
const { sequelize, Sequelize, QueryTypes } = db;
const statusCode = require("../../../utils/statusCode");
const { foodListings, foodListingItems, entityTypes } = db;
const imageUpload = require("../../../utils/imageUpload");
const fetchMasterData = require("../../../utils/fetchMasterData");
const { formatDateToDDMMYYYYHHMMSSMS, calculateDistance, validateAndConvertDate } = require("../../../utils/commonFunctions");
const timeZone = process.env.TIMEZONE;

let addFoodDonationRequest = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let { foodItemsArray, receiverId } = req.body;
        let userId = req.user?.userId || 1;
        let subDir = '/foodDonation';
        //check if any detail is missing
        console.log("check submitted details start");
        for (let foodItem of foodItemsArray) {
            if (foodItem.foodName == undefined || !foodItem.foodName) {
                console.log("foodItem.foodName not provided");
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide all data."
                });
            }
            if (foodItem.foodCategory == undefined || !foodItem.foodCategory) {
                console.log("foodItem.foodCategory not provided");
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide all data."
                });
            }
            if (foodItem.quantity == undefined || !foodItem.quantity) {
                console.log("foodItem.quantity not provided");
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide all data."
                });
            }
            if (foodItem.unit == undefined || !foodItem.unit) {
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
        for (let foodItem of foodItemsArray) {
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
            if (errors.length > 0) {
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
        let { page_size, page_number, timeLimit, userLatitude, userLongitude, distanceRange, foodType, givenReq } = req.body;
        let limit = page_size || 50;
        let page = page_number || 1;
        let offset = (page - 1) * limit;
        let isDate = validateAndConvertDate(givenReq).isValid;
        console.log("isDate", isDate);
        if (givenReq) {
            if (isDate) {
                givenReq = validateAndConvertDate(givenReq).data;
            }
            else {
                givenReq = givenReq.toLowerCase();
            }
        }
        else {
            givenReq = null;
        }
        console.log({ page_size, page_number, timeLimit, userLatitude, userLongitude, distanceRange, foodType, givenReq });
        let foodDonationListQuery = `
            select
                u."userId", u."name", u."phoneNumber",
                TO_CHAR(
                    u."createdOn" AT TIME ZONE 'Asia/Kolkata' AT TIME ZONE 'UTC',
                    'YYYY-MM-DD"T"HH24:MI:SS.MS'
                ) as createdOn,
                u.latitude, u.longitude, count(fli."foodListingItemId") as totalItems 
            from soulshare."foodListings" fl
            inner join soulshare."foodListingItems" fli on fl."foodListingId" = fli."foodListingId"
            inner join soulshare."statusMasters" sm on fl."statusId" = sm."statusId" and sm."parentStatusCode" = 'RECORD_STATUS'
            inner join soulshare.users u on u."userId" = fl."userId"
            where sm."statusCode" = 'ACTIVE'
            group by u."userId", u."name", u."createdOn", u.latitude, u.longitude
            order by u."createdOn" desc
        `;
        let fetchFoodDonationListData = await sequelize.query(foodDonationListQuery, {
            type: Sequelize.QueryTypes.SELECT,
        });
        console.log("fetchFoodDonationListData", fetchFoodDonationListData);
        let foodDonationData = fetchFoodDonationListData;
        if (timeLimit) {   //if timelimit provided, then filter records accordingly
            console.log("timeLimit filter");
            switch (timeLimit) {
                case "Today":
                    foodDonationData = foodDonationData.filter((data) => {
                        const today = new Date(); // Current date and time
                        // Set to start of today
                        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
                        // Set to end of today
                        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
                        return new Date(data.createdOn) >= startOfToday && new Date(data.createdOn) <= endOfToday;
                    });
                    break;
                case "Yesterday":
                    foodDonationData = foodDonationData.filter((data) => {
                        const today = new Date(); // Current date and time
                        // Set to start of today
                        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0, 0);
                        // Set to end of today
                        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59, 999);
                        return new Date(data.createdOn) >= startOfToday && new Date(data.createdOn) <= endOfToday;
                    });
                    break;
                case "Last 7 days":
                    foodDonationData = foodDonationData.filter((data) => {
                        const today = new Date(); // Current date and time
                        // Set to start of today
                        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6, 0, 0, 0, 0);
                        // Set to end of today
                        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6, 23, 59, 59, 999);
                        return new Date(data.createdOn) >= startOfToday && new Date(data.createdOn) <= endOfToday;
                    });
                    break;
                default:
                    break;
            }
        }
        if (distanceRange) {    // filter records whose distance falls within user provided range(kms)
            console.log("distanceRange filter");
            if (!userLatitude || !userLongitude) {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: "Please provide location access."
                })
            }
            else {
                foodDonationData = foodDonationData.filter((food, index, foodDonationData) => {
                    let distance = calculateDistance(userLatitude, userLongitude, food.latitude, food.longitude);
                    food.distance = distance;
                    if (distance <= distanceRange)
                        return food;
                });
            }
        }
        if (foodType) {     // filter records according to food type selected
            console.log("foodType filter");
            foodDonationData = foodDonationData.filter((food, index, foodDonationData) => {
                return food.foodType == foodType;
            })
        }

        if (givenReq) {
            foodDonationData = foodDonationData.filter((food, index, foodDonationData) => {
                console.log("givenReq", givenReq, isDate);
                if (isDate) {
                    console.log("food createdon", food.createdon, food.createdon?.toString().includes(givenReq));
                    return food.createdon?.toString().includes(givenReq);
                }
                else {
                    return food.name?.toLowerCase().includes(givenReq) ||
                    food.createdon?.toString().includes(givenReq);
                }
            })
        }
        console.log("foodDonationData", foodDonationData);
        foodDonationData = foodDonationData.slice(offset, offset + limit);
        res.status(statusCode.SUCCESS.code).json({
            message: "view food donation list",
            foodDonationData
        });
    }
    catch (error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        });
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
