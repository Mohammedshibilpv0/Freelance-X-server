import { ICategory } from "./Category";

export interface ISubcategory {
  _id?: string;
  name: string;
  description: string;
  category: string | ICategory;
  isDeleted?:boolean
}
