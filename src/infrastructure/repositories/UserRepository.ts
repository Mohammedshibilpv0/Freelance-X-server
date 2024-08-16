import mongoose from 'mongoose';
import UserModel from "../database/models/UserModel";
import SubCategory from '../database/models/Subcategory';
import { IUserRepository } from "../../interface/IUserRepository";
import { IUser } from "../../doamin/entities/User";
import { IOtp } from "../../doamin/entities/Otp"
import OtpModel from "../database/models/OtpModel";
import { ISubcategory } from '../../doamin/entities/SubCategory';

const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
  };

export default class UserRepository implements IUserRepository{
    async create(user: IUser): Promise<IUser> {
        return UserModel.create(user)
    }
    async FindOtpUser (email:string):Promise<IOtp|null>{
     return OtpModel.findOne({email})   
    }

    async updateUser(user:IUser,email:string):Promise<IUser|null>{
    return  await UserModel.findOneAndUpdate({email},user,{new:true})
    
    }

    async findByEmail(email:string):Promise<IUser|null>{        
        return await UserModel.findOne({email}).exec()
    
        
    }
    async findById(id:string):Promise<IUser|null>{        
       return await UserModel.findById(id)
        
    }

    async createOtp(email:string,otp:string,expiresAt:Date):Promise<IOtp>{
        return OtpModel.findOneAndUpdate({email},{otp,expiresAt}, { upsert: true, new: true, setDefaultsOnInsert: true })
    }
    
    async changeRole(email: string, role: string): Promise<IUser | null> {
        return UserModel.findOneAndUpdate({email},{role})
    }
   
    async subCategories(categoryId: string): Promise<ISubcategory[] | null> {
        try {
            if (!isValidObjectId(categoryId)) {
                throw new Error(`Invalid category ID: ${categoryId}`);
            }
            const subcategories = await SubCategory.find({ category: categoryId });
            return subcategories.length > 0 ? subcategories : null;
        } catch (error) {
            return null;
        }
    }

    

   
}