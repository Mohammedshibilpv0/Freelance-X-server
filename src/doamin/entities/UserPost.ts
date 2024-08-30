import { ICategory } from "./Category";
import { ISubcategory } from "./SubCategory";

export interface IUserPost{
projectName: string;
description: string;
skills: string[];
startBudget: string;
status?:string
endBudget: string;
deadline: Date;
keyPoints: string[];
images: string[];
searchKey: string[];
category: string | ICategory;
subcategory: string|ISubcategory;
requests?:requestInterface[]
createAt?:Date
modules?:[UserPostModule]
email?:string
userId?:string
paymentAmount?:number
}

export interface requestInterface{
    id?:string
    message:string,
    price:number,
    userId?:string
    status?:string
}

export interface UserPostModule{
    heading: string, 
    date: Date, 
    amount: number 
    isPaid:boolean
}