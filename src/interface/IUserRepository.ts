import { IUser } from "../doamin/entities/User";
import { IOtp } from "../doamin/entities/Otp";
import { ISubcategory } from "../doamin/entities/SubCategory";

export interface IUserRepository {
    create(user:IUser):Promise<IUser>
    updateUser(User:IUser,email:string):Promise<IUser|null>
    createOtp(email:string,otp:string,expiresAt:Date):Promise<IOtp>
    findByEmail(email:string):Promise<IUser|null>
    FindOtpUser(email:string):Promise<IOtp|null>
    changeRole(email:string,role:string):Promise<IUser|null>
    subCategories(categoryId:string):Promise<ISubcategory[]|null>
    findById(id:string):Promise<IUser|null>
    
}