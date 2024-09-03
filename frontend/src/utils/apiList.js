const api = {
    ADD_FOOD_DONATION: {
        url: "/food/addFoodDonationRequest",
        method: "post"
        /**
         * 1. foodItemsArray [Object]:-
         *      foodItemsArray = [{ foodName, foodCategory, quantity, unit, expirationDate, imageData }, ...]
         * 2. receiverId integer
         */
    },
}

export default api;