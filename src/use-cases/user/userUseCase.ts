import { IUser, UserShortDetails } from "../../doamin/entities/User";
import { IUserRepository } from "../../interface/IUserRepository";
import { ISubcategory } from "../../doamin/entities/SubCategory";
import { ICategory } from "../../doamin/entities/Category";
import { IFriendsLists } from "../../doamin/entities/IFriendsLists";
import { IMessage } from "../../doamin/entities/Message";
import { INotification } from "../../infrastructure/database/models/NotificationModel";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import { IPaymentTransaction } from "../../infrastructure/database/models/TransactionModel";
import { IReport } from "../../infrastructure/database/models/ReportModel";
import { ReportRequestBody } from "../../doamin/entities/Report";


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


    
   async categories ():Promise<ICategory[]|null>{
    const categories=await this.userepository.categories()
    if(categories==null){
        return null
    }
    if(categories.length<0){
        return null
    }
    return categories
   }
    
   async findLists (id:string):Promise<IFriendsLists|null>{
    const lists =await this.userepository.findUsersConnections(id)
    return lists
   }

   async getMessages (id:string):Promise<IMessage[]|null>{
    const messages= await this.userepository.getMessages(id)
    return messages
   }

   async getNotifications (id:string):Promise<INotification[]|null|undefined>{
    const notifications= await this.userepository.getNotifications(id)
    return notifications
   }

   async transactionHistory(id: string, page: number, limit: number): Promise<{ transaction: IPaymentTransaction[], totalPages: number } | null> {
    try {
      const { transaction, totalPages } = await this.userepository.transactionHistory(id, page, limit);
  
      return { transaction, totalPages };
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return null;
    }
  }

  async handleReport (data:ReportRequestBody):Promise<ReportRequestBody |null|undefined>{
    try{
        const report= await this.userepository.reportUser(data)
        return report
    }catch(err){
        return null
    }
  }
  
}