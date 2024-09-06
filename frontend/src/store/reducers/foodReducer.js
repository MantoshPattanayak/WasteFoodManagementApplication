import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    foodDonationList: [],
}

const foodReducer = createSlice({
    name: "food",
    initialState,
    reducers: {
        setFoodList(state = initialState, action) {
            const { foodDonationList } = action.payload;
            state.foodDonationList = foodDonationList;
            console.log("initial state", foodDonationList);
        },
        
    },
});

export const { fetchFoodList } = foodReducer.actions;
export default foodReducer.reducer;