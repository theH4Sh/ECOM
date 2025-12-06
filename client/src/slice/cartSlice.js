import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity, name, image, price } = action.payload;

      const existingItem = state.items.find(item => item.product === product);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          name,
          image,
          price,
          quantity
        });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        item => item.product !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
