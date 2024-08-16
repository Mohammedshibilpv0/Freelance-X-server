import { IUser } from "../../doamin/entities/User";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import { sendOtpEmail } from "../../utils/sendOtp";
import bcrypt from 'bcrypt'

export default class forgetPasswordUsecase{
    private userepository:UserRepository;

    constructor(userRepository:UserRepository){
        this.userepository=userRepository
    }

    async createOtp(email:string):Promise<IUser|undefined>{
        try{
            const user = await this.userepository.findByEmail(email)
            if(!user){
                return undefined
            }
            let otp = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
            const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
            await this.userepository.createOtp(email,otp,expiresAt)
            await sendOtpEmail(email,otp)
            return user
        }catch(err){
            console.log(err);
            
        }
       
    }

    async verifyForgetOtp(email:string,otp:string){
        try{
           const checkUser=await this.userepository.FindOtpUser(email)
           if(!checkUser){
            return "User Not Found"
           }
           if(checkUser.otp!==otp){
            return "Incorrect Otp"
           }
           if(checkUser.expiresAt.getTime()<Date.now()){
            return "Otp has expired"
           }
           return 'Otp verified'
        }catch(err){
            return err
            
        }
    }

    async changepassword(email:string,password:string){
         try{
            password= await bcrypt.hash(password,10)
            const updatePassword= await this.userepository.updateUser({email,password},email)
        
            if(!updatePassword){
                return "User not found"
            }
            return "User Details Changed"
         }catch(err){
            return err
         }
    }

}