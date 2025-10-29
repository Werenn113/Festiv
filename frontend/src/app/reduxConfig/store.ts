import { persistStore, persistReducer } from 'redux-persist';
import { configureStore } from "@reduxjs/toolkit";
import { rootPersistConfig, rootReducer } from './rootReducer';
// import { apiSlice } from './apiSlice';
// import { setRefreshTokenMiddleware } from './authMiddleware';

// reducer with configuration to persist the states to local storage
const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
    reducer: {
        // [apiSlice.reducerPath] : apiSlice.reducer,
        persistedReducer,
    },
    middleware: getDefaultMiddleware => // allow us to customize the dispatch function
        getDefaultMiddleware({
            serializableCheck: false, // do not check if data is serializable (aka convertible to json without errors)
            immutableCheck: false, // do not check if action objects (arguments type & payload reveived by each reducer) are immutable
        }),
    devTools: true
})

export const persistor = persistStore(store);

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {auth: authReducer}
export type AppDispatch = typeof store.dispatch