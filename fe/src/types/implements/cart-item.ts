import { IPainting } from "./painting";

export interface ICartItem {
  cartItemId: string;
  painting: IPainting;
  quantity: number;
}
