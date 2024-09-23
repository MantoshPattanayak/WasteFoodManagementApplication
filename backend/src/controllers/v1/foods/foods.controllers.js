const db = require("../../../models");
const { sequelize, Sequelize, QueryTypes } = db;
const statusCode = require("../../../utils/statusCode");
const { foodListings, foodListingItems, entityTypes } = db;
const imageUpload = require("../../../utils/imageUpload");
const fetchMasterData = require("../../../utils/fetchMasterData");
const { formatDateToDDMMYYYYHHMMSSMS, calculateDistance, validateAndConvertDate } = require("../../../utils/commonFunctions");
const timeZone = process.env.TIMEZONE;
let foodCategories = db.foodCategories
const logger = require('../../../logger/index.logger')

let addFoodDonationRequest = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let { foodItemsArray, receiverId, address } = req.body;
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

        //check if address details present correctly
        let addressDetails = ['building', 'area', 'landmark', 'pincode', 'townCity', 'state'];
        for (let key of Object.keys(address)) {
            if (!addressDetails.includes(key) || (key != 'landmark' && !address[key])) {
                return res.status(statusCode.BAD_REQUEST.code).json({
                    message: `please provide all required data to set up the profile`
                });
            }
        }
        console.log("check submitted details end");
        // fetch entity types data
        // let entityTypesMasterData = await fetchMasterData('entityTypes');
        // console.log("entityTypesMasterData", entityTypesMasterData);
        // entityTypesMasterData = entityTypesMasterData.filter((data) => { return data.entityTypeName == "foodDonation" });
        // console.log("entityTypesMasterData filtered foodDonation", entityTypesMasterData);
        // insert into foodListing table
        let insertFoodListing = await foodListings.create({
            userId: userId,
            statusId: 1,
            address: address,
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
            let imageFileUpload = imageUpload(foodItem.imageData, "foodDonation", subDir, insertionData, userId, errors, serialNumber, transaction);
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
        logger.error(`An error occurred: ${error.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let initialData = async (req, res) => {
    try {
        console.log('232')
        let timeRange = [{ time: 'Today' }, { time: 'Yesterday' }];
        let distanceRange = [
            { 0: 1 },
            { 1: 2 },
            { 2: 5 },
            { 3: 10 }
        ]
        let foodType = await foodCategories.findAll({
            where: {
                statusId: 1
            },
            type: QueryTypes.SELECT
        });
        let unitsData = await db.units.findAll({
            where: {
                statusId: 1
            }
        });

        return res.status(statusCode.SUCCESS.code).json({
            message: 'food donation list filter dropdown data',
            timeRange, distanceRange, foodType, unitsData
        })
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

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
        let currDate = new Date();
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
                    fl."createdOn" AT TIME ZONE 'Asia/Kolkata' AT TIME ZONE 'UTC',
                    'YYYY-MM-DD"T"HH24:MI:SS.MS'
                ) as createdOn,
                u.latitude, u.longitude, fli."foodName", TO_CHAR(
                    fli."expirationDate"  AT TIME ZONE 'Asia/Kolkata' AT TIME ZONE 'UTC',
                    'YYYY-MM-DD"T"HH24:MI:SS.MS'
                ) as expirationDate, u."phoneNumber", fl."address", fli."foodCategory" as foodType
            from soulshare."foodListings" fl
            inner join soulshare."foodListingItems" fli on fl."foodListingId" = fli."foodListingId"
            inner join soulshare."statusMasters" sm on fl."statusId" = sm."statusId" and sm."parentStatusCode" = 'RECORD_STATUS'
            inner join soulshare.users u on u."userId" = fl."userId"
            where sm."statusCode" = 'ACTIVE' and "expirationDate" >= :currDate
            order by u."createdOn" desc
        `;
        console.log('foodDonationListQuery', foodDonationListQuery)

        let fetchFoodDonationListData = await sequelize.query(foodDonationListQuery, {
            type: Sequelize.QueryTypes.SELECT,
            replacements:{currDate:currDate}
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
                return food.foodtype == foodType;
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
        logger.error(`An error occurred: ${error.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        });
    }
}

let viewFoodDonationById = async (req, res) => {
    try {
        let foodListingId = req.params.id;
        let foodDonationListQuery = `
            select
                fl."foodListingId", fli."foodListingItemId", fli."foodName", fli."foodCategory", fc."foodCategoryName", fli.quantity, fli.unit, u2."unitName",
                CASE
                    when fli."expirationDate" is null then null
                    else TO_CHAR(fli."expirationDate"AT TIME ZONE 'Asia/Kolkata' AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS')
                    end as expirationDate, fli."statusId", sm.description, u."userId", u."name", u."phoneNumber",
                TO_CHAR(
                    fl."createdOn" AT TIME ZONE 'Asia/Kolkata' AT TIME ZONE 'UTC',
                    'YYYY-MM-DD"T"HH24:MI:SS.MS'
                ) as createdOn, u.latitude, u.longitude
            from soulshare."foodListings" fl
            inner join soulshare."foodListingItems" fli on fl."foodListingId" = fli."foodListingId"
            inner join soulshare."foodCategories" fc on fli."foodCategory" = fc."foodCategoryId"
            inner join soulshare.units u2 on u2."unitId" = fli.unit
            inner join soulshare."statusMasters" sm on fl."statusId" = sm."statusId" and sm."parentStatusCode" = 'RECORD_STATUS'
            inner join soulshare.users u on u."userId" = fl."userId"
            where fl."foodListingId" = :foodListingId
        `;
        let fetchFoodListingDetails = await sequelize.query(foodDonationListQuery, {
            replacements: {
                foodListingId: foodListingId
            },
            type: Sequelize.QueryTypes.SELECT
        });

        if (fetchFoodListingDetails.length > 0) {
            return res.status(statusCode.SUCCESS.code).json({
                message: "Food donation details",
                fetchFoodListingDetails
            })
        }
        else {
            return res.status(statusCode.NOTFOUND.code).json({
                message: "Food donation details not found",
            });
        }
    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

        res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

let acceptFoodDonation = async (req, res) => {
    try {

    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

    }
}

let closeFoodDonation = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let today = new Date();
        let userId = req.user?.userId || 1;
        let { foodListingId } = req.body;
        let statusMasterData = await db.statusMaster.findAll({
            where: {
                parentStatusCode: "FOOD_DONATION_STATUS"
            }
        });
        console.log("statusMasterData", statusMasterData);
        statusMasterData = statusMasterData.filter((data) => { return data.statusCode == "CLOSED" });

        let [updateCount] = await foodListings.update({
            statusId: statusMasterData[0].statusId,
            updatedBy: userId,
            updatedOn: today
        }, {
            where: {
                foodListingId: foodListingId
            },
            transaction
        });
        console.log("updated", updateCount > 0);
        if (updateCount > 0) {
            transaction.commit();
            return res.status(statusCode.SUCCESS.code).json({
                message: "Food donation is closed."
            });
        } else {
            transaction.rollback();
            return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: "Something went wrong."
            });
        }
    }
    catch (error) {
        transaction.rollback();
        logger.error(`An error occurred: ${error.message}`); // Log the error

        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        });
    }
}

let viewFoodPickupList = async (req, res) => {
    try {

    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

    }
}

let viewFoodPickupById = async (req, res) => {
    try {

    }
    catch (error) {
        logger.error(`An error occurred: ${error.message}`); // Log the error

    }
}

let donationHistory = async (req, res) => {
    try {
        let { page_size, page_number, timeLimit, userLatitude, userLongitude, distanceRange, foodType, givenReq } = req.body;
        let limit = page_size || 50;
        let page = page_number || 1;
        let offset = (page - 1) * limit;
        let isDate = validateAndConvertDate(givenReq).isValid;
        console.log("isDate", isDate);
        let { userId } = req.user || req.body;
        console.log("userId", userId);
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
                    fl."createdOn" AT TIME ZONE 'Asia/Kolkata' AT TIME ZONE 'UTC',
                    'YYYY-MM-DD"T"HH24:MI:SS.MS'
                ) as createdOn,
                u.latitude, u.longitude, fli."foodName", TO_CHAR(
                    fli."expirationDate"  AT TIME ZONE 'Asia/Kolkata' AT TIME ZONE 'UTC',
                    'YYYY-MM-DD"T"HH24:MI:SS.MS'
                ) as expirationDate, u."phoneNumber", fl."address", fli."foodCategory" as foodType
            from soulshare."foodListings" fl
            inner join soulshare."foodListingItems" fli on fl."foodListingId" = fli."foodListingId"
            inner join soulshare."statusMasters" sm on fl."statusId" = sm."statusId" and sm."parentStatusCode" = 'RECORD_STATUS'
            inner join soulshare.users u on u."userId" = fl."userId"
            where sm."statusCode" = 'ACTIVE' and u."userId" = ?
            order by u."createdOn" desc
        `;
        let fetchFoodDonationListData = await sequelize.query(foodDonationListQuery, {
            replacements: [userId],
            type: Sequelize.QueryTypes.SELECT,
        });
        console.log("fetchFoodDonationListData", fetchFoodDonationListData);
        let foodDonationData = fetchFoodDonationListData;
        /*
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
                return food.foodtype == foodType;
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
        */
        foodDonationData = foodDonationData.slice(offset, offset + limit);
        res.status(statusCode.SUCCESS.code).json({
            message: "view food donation list",
            foodDonationData
        });
    }
    catch(error) {
        return res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: error.message
        })
    }
}

module.exports = {
    addFoodDonationRequest,
    initialData,
    viewFoodDonationList,
    viewFoodDonationById,
    acceptFoodDonation,
    closeFoodDonation,
    viewFoodPickupList,
    viewFoodPickupById,
    donationHistory
}
