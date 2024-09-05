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
    }
}

export default api;