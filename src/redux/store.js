import employeeSlice from './employee/employeeSlice';
import topicSlice from "./topic/topicSlice";
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';


import { persistReducer, persistStore } from 'redux-persist';
import { configureStore, combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ['navigation']
}

const reducer = combineReducers({
    employee: employeeSlice,
    topic : topicSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = configureStore({
    // reducer: persistedReducer,
    reducer,
    devTools: true,
    middleware: [thunk]
})

export const persistor = persistStore(store)