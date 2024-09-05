import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
}

const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state = initialState, action) {
            
        },
    }
})

export default authReducer.reducer;
export const { login, logout } = authReducer.actions;