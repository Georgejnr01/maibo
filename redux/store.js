import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import cartReducer from "./slices/cart";
import ExchangeRateReducer from "./slices/rate";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    exchangeRate: ExchangeRateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
