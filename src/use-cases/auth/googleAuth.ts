import { create } from "domain";
import { IUser } from "../../doamin/entities/User";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import { generateAccessToken, generateRefreshToken } from "../../interface/security/jwt";
export default class googleAuth{
    private userepository:UserRepository;

    constructor(userRepository:UserRepository){
        this.userepository=userRepository
    }

    async handlegoogleAuth(user:IUser){
        const checkUser= await this.userepository.findByEmail(user.email)
        if(checkUser){
          let accessToken=  generateAccessToken(checkUser)
          let refreshToken= generateRefreshToken(checkUser)
          checkUser.refreshToken=refreshToken
          await this.userepository.updateUser(checkUser,user.email)
          return {message:"user loged", accessToken,refreshToken}
        }else{
         const createUser= await this.userepository.create(user)
         let accessToken=  generateAccessToken(createUser)
          let refreshToken= generateRefreshToken(createUser)
          createUser.refreshToken=refreshToken
          await this.userepository.updateUser(createUser,user.email)
          return {message:"new user Created", accessToken,refreshToken}
        }        
    }

}