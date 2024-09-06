import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'root',    //
    storage,
    /*
    whitelist: ['foodReducer'],  // Optional: Specify which reducers to persist
    blacklist: [],  //Optional: Specify which reducers not to persist
    */
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);