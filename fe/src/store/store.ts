import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/auth-slice";
import checkoutReducer from "./slice/checkout-slice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // default: localStorage

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  checkout: checkoutReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["checkout"], // chỉ persist checkout
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Setup store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor dùng cho Provider
export const persistor = persistStore(store);

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
