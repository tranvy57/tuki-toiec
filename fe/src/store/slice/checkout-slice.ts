import { IPainting } from "@/types/implements/painting";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ICartItem } from "@/types/implements/cart-item";

interface CheckoutState {
  selectedCartItems: ICartItem[];
  totalPaintingsPrice: number;
  deliveryCost: number;
  totalPrice: number;
  couponCode: string;
  discount: number;
}

const initialState: CheckoutState = {
  selectedCartItems: [],
  totalPaintingsPrice: 0,
  deliveryCost: 0,
  totalPrice: 0,
  couponCode: "",
  discount: 0,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutData: (state, action: PayloadAction<CheckoutState>) => {
      return action.payload;
    },
    setSelectedCoupon: (
      state,
      action: PayloadAction<{ couponCode: string; discount: number }>
    ) => {
      state.couponCode = action.payload.couponCode;
      state.discount = action.payload.discount;
    },
    clearCheckoutData: () => initialState,
  },
});

export const { setCheckoutData, clearCheckoutData, setSelectedCoupon } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
