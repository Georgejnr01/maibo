import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  totalPrice: 0,
};

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add: (state, action) => {
      let cart = state.products.filter(
        (item) => item._id
      );
      state.products = [...cart, action.payload];
      localStorage.setItem("products", JSON.stringify([...state.products]));
    },
    addFromLocalStorage: (state, action) => {
      state.products = [...action.payload];
    },
    increment: (state, action) => {
      let cart = state.products.map((item) => {
        if (item._id === action.payload._id) {
          item.quantity++;
        }
        return item;
      });
      state.products = [...cart];
      localStorage.setItem("products", JSON.stringify([...cart]));
    },
    decrement: (state, action) => {
      let cart = state.products.map((item) => {
        if (item._id === action.payload._id) {
          item.quantity--;
        }
        return item;
      });
      state.products = [...cart];
      localStorage.setItem("products", JSON.stringify([...cart]));
    },
    remove: (state, action) => {
      let cart = state.products.filter(
        (item) => item._id !== action.payload._id
      );
      state.products = [...cart];
      localStorage.setItem("products", JSON.stringify([...cart]));
    },
    clear: (state) => {
      state.products = [];
      localStorage.removeItem("products");
    },
    addTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
  },
});

export const {
  add,
  addFromLocalStorage,
  addTotalPrice,
  remove,
  clear,
  increment,
  decrement,
} = CartSlice.actions;

export default CartSlice.reducer;
