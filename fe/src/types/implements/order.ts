import { IPainting } from "./painting";

export interface IOrder {
  orderId: string;
  orderDate: Date;
  status: string;
  deliveryCost: number;
  totalPaintingsPrice: number;
  totalPrice: number;
  zipCode: string;
  prefecture: string;
  city: string;
  town: string;
  addressDetail: string;
  note: string;
  imagePayment: string;
  paymentMethod: string;
  receiverName: string;
  phone: string;
  email: string;
  postalCode: string;
  contact: string;
  orderItems: IOrderItem[];
  discount: number;
}

export interface IOrderItem {
  orderItemId: string;
  currentPrice: number;
  quantity: number;
  painting: IPainting;
  order: IOrder;
}
