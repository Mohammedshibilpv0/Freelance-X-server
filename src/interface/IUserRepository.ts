import { IUser } from "../doamin/entities/User";
import { IOtp } from "../doamin/entities/Otp";
import { ISubcategory } from "../doamin/entities/SubCategory";
import { ICategory } from "../doamin/entities/Category";
import { IFriendsLists } from "../doamin/entities/IFriendsLists";
import { IMessage } from "../doamin/entities/Message";
import { INotification } from "../infrastructure/database/models/NotificationModel";

export interface IUserRepository {
    create(user:IUser):Promise<IUser>
    updateUser(User:IUser,email:string):Promise<IUser|null>
    createOtp(email:string,otp:string,expiresAt:Date):Promise<IOtp>
    findByEmail(email:string):Promise<IUser|null>
    FindOtpUser(email:string):Promise<IOtp|null>
    changeRole(email:string,role:string):Promise<IUser|null>
    subCategories(categoryId:string):Promise<ISubcategory[]|null>
    findById(id:string):Promise<IUser|null>
    categories():Promise<ICategory[]|null>
    saveMessage(senderId:string,receiverId:string,message:string,initial:boolean,messageId:string):Promise<any|null>
    findUsersConnections(id:string):Promise<IFriendsLists|null>
    getMessages(conversationId:string):Promise<IMessage[]|null>
    setNotification(senderId:string,receiverId:string,text:string):Promise<INotification|null>
    updateMessage(id: string, status: 'sent' | 'delivered' | 'read'): Promise<IMessage | null> 
}