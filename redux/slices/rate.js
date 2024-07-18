import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  rate: 223,
  currency: "",
};

export const ExchangeRateSlice = createSlice({
  name: "exchangeRate",
  initialState,
  reducers: {
    update: (state, action) => {
      state.rate = action.payload.rate;
      state.currency = action.payload.currency;
    },
  },
});

export const { update } = ExchangeRateSlice.actions;

export default ExchangeRateSlice.reducer;
