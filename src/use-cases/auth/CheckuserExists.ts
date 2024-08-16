import { IUser } from "../../doamin/entities/User";
import UserRepository from "../../infrastructure/repositories/UserRepository";

export default class CheckuserExists{
    private userepository:UserRepository;

    constructor(userRepository:UserRepository){
        this.userepository=userRepository
    }

    async execute(email:string):Promise<IUser|undefined>{
        const user = await this.userepository.findByEmail(email)
        return user||undefined
    }

}