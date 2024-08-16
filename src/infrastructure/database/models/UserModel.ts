import { IUser } from "../../../doamin/entities/User";
import { Schema,model } from "mongoose";

const userSchema = new Schema<IUser>({
    firstName:{type:String},
    secondName:{type:String},
    email: { type: String, required: true },
    password: { type: String },
    role:{type:String,default:'Client'},
    phone: { type: String },
    refreshToken: { type: String },
    createAt: { type: Date, default: Date.now },
    country: { type: String },
    skills: [{type:String}],
    profile:{type:String},
    description:{type:String},
    isAdmin:{type:Boolean,default:false},
    isBlock :{type:Boolean, default:false}
});

const UserModel=model<IUser>('User',userSchema)
export default UserModel