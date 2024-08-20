import { IUser, UserShortDetails } from "../../doamin/entities/User";
import { IUserRepository } from "../../interface/IUserRepository";
import { ISubcategory } from "../../doamin/entities/SubCategory";


export default class userUseCase{
    private userepository:IUserRepository;
    
    constructor(userRepository:IUserRepository){
        this.userepository=userRepository
    }

    async editUserProfile(userData:IUser):Promise<IUser |null>{
        return await this.userepository.updateUser(userData,userData.email)
    }

    async changeUserRole(email:string,role:string):Promise<IUser |null>{
        return await this.userepository.changeRole(email,role)
    }

    async getSubcategories(categoryId:string):Promise<ISubcategory[]|null>{
        const fetchSubcategories=await this.userepository.subCategories(categoryId)        
        if(fetchSubcategories==null){
            return null
        }
        return fetchSubcategories
    }

    async findUserById(id: string): Promise<UserShortDetails | null | undefined> {
        const findUser = await this.userepository.findById(id);
        if (findUser !== null) {
            const { firstName, secondName, skills, createAt, profile, description } = findUser;
            const user: UserShortDetails = {
                firstName: firstName!, 
                secondName: secondName!,
                skills: skills,
                createAt: createAt!,
                profile: profile!,
                description: description!,
            };
            return user;
        }
        return findUser;
    }
    
    
}