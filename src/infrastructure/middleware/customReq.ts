import { Request } from "express";

export interface CustomRequest extends Request{
    user?:{id:string,email:string,isAdmin:boolean|undefined}
}