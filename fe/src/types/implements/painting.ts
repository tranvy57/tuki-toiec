import { BaseEntity } from "../base-entity";

export interface ICategory extends BaseEntity {
  categoryId: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface IPainting extends BaseEntity {
  paintingId: string;
  name: string;
  description: string;
  imageUrl: string;
  size: string;
  price: number;
  quantity: number;
  categories: ICategory[];
}
