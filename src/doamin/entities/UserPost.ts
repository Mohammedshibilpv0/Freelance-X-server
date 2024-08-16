import { ICategory } from "./Category";
import { ISubcategory } from "./SubCategory";

export interface IUserPost{
projectName: string;
description: string;
skills: string[];
startBudget: string;
endBudget: string;
deadline: Date;
keyPoints: string[];
images: string[];
searchKey: string[];
category: string | ICategory;
subcategory: string|ISubcategory;
createAt?:Date
email?:string
userId?:string

}