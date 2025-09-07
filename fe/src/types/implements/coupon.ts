import { BaseEntity } from "../base-entity";

export interface ICoupon extends BaseEntity {
  couponId: string;
  code: string;
  imageUrl: string;
  description: string;
  condition: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
}
