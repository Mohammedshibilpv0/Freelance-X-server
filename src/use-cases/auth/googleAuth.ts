import { create } from "domain";
import { IUser } from "../../doamin/entities/User";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import { generateAccessToken, generateRefreshToken } from "../../interface/security/jwt";
import JWTHelper from "../../utils/googleAuth";


const jwtDecode=new JWTHelper()
export default class GoogleAuthUseCase{
    private userepository:UserRepository;

    constructor(userRepository:UserRepository){
        this.userepository=userRepository
    }

    async handlegoogleAuth(userCredential:string){
       const userData:any=  jwtDecode.decodeGoogleIdToken(userCredential)
       if(userData && userData){
         const {email,sub,picture,given_name,family_name}=userData
         const checkUserAlready=await this.userepository.findByEmail(email)
         if(checkUserAlready){
          return checkUserAlready
        }else{
          const user={
            email:email,
            password:sub,
            profile:picture,
            firstName:given_name,
            secondName:family_name
          }
         const createUser=await this.userepository.create(user)
         if(createUser){
          return createUser
         }
         return 
        }
       }
      }

}