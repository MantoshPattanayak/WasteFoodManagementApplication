import instance from "../../env";
const baseURL = instance().baseURL;
const api = {
    ADD_FOOD_DONATION: {
        url: baseURL + "/food/addFoodDonationRequest",
        method: "post"
        /**
         * in req.body
         * 1. foodItemsArray [Object]:-
         *      foodItemsArray = [{ foodName, foodCategory, quantity, unit, expirationDate, imageData }, ...]
         * 2. receiverId integer
         */
    },
    INITIAL_FOOD_DROPDOWN_DATA: {
        url: baseURL + "/food/initialData",
        method: "get",
        /**
         * for timeRange and distanceRange, send the option's value
         * for foodType, send the option's id
         */
    },
    VIEW_FOOD_DONATION_LIST: {
        url: baseURL + "/food/viewFoodDonationList",
        method: "post"
        /**
         * in req.body - page_size, page_number, timeLimit, userLatitude, userLongitude, distanceRange, foodType, givenReq
         */
    },
    VIEW_FOOD_DONATION_BY_ID: {
        url: baseURL + "/food/viewFoodDonationById",
        method: "get",
        /**
         * in req.params - foodListingId
         */
    },
    CLOSE_FOOD_DONATION: {
        url: baseURL + "/food/closeFoodDonation",
        method: "put",
        /**
         * in req.body - foodListingId
         */
    },
    LOGIN_CREATE_OTP: {
        url: baseURL + "/auth/createOtp",
        method: "post",
        /**
         * req body - encryptMobile
         */
    },
    LOGIN_WITH_OTP: {
        url: baseURL + "/auth/loginWithOTP",
        method: "post",
        /**
         * req body - encryptMobile, encryptOtp
         */
    },
    LOGOUT: {
        url: baseURL + "/auth/logout",
        method: "post"
    },
    SIGNUP: {
        url: baseURL + "/auth/signup",
        method: "post",
        /**
         * name, email, phoneNumber, longitude, latitude, userType, userImage
         */
    },
    USER_INITIALDATA: {
        url: baseURL + '/auth/initialData',
        method: "get",
    },
    REFRESH_TOKEN: {
        url: baseURL + '/auth/refresh-token',
        method: "post",
    },
    SEARCH_PLACE_BY_PINCODE: {
        url: "https://api.postalpincode.in/pincode/",
        method: "get"
    }
}

export default api;