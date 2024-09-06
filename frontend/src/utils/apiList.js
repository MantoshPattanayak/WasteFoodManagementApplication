const api = {
    ADD_FOOD_DONATION: {
        url: "/food/addFoodDonationRequest",
        method: "post"
        /**
         * in req.body
         * 1. foodItemsArray [Object]:-
         *      foodItemsArray = [{ foodName, foodCategory, quantity, unit, expirationDate, imageData }, ...]
         * 2. receiverId integer
         */
    },
    INITIAL_FOOD_DROPDOWN_DATA: {
        url: "/food/initialData",
        method: "get",
        /**
         * for timeRange and distanceRange, send the option's value
         * for foodType, send the option's id
         */
    },
    VIEW_FOOD_DONATION_LIST: {
        url: "/food/viewFoodDonationList",
        method: "post"
        /**
         * in req.body - page_size, page_number, timeLimit, userLatitude, userLongitude, distanceRange, foodType, givenReq
         */
    },
    VIEW_FOOD_DONATION_BY_ID: {
        url: "/food/viewFoodDonationById",
        method: "get",
        /**
         * in req.params - foodListingId
         */
    },
    CLOSE_FOOD_DONATION: {
        url: "/food/closeFoodDonation",
        method: "put",
        /**
         * in req.body - foodListingId
         */
    },
    LOGIN_CREATE_OTP: {
        url: "/auth/createOtp",
        method: "post",
    },
    LOGIN_VERIFY_OTP: {
        url: "/auth/verifyOtp",
        method: "post",
    },
    LOGIN_WITH_OTP: {
        url: "/auth/loginWithOTP",
        method: "post",
    },
    LOGOUT: {
        url: "/auth/logout",
        method: "post"
    }
}

export default api;