import { IUser } from "../doamin/entities/User";
import { IOtp } from "../doamin/entities/Otp";
import { ISubcategory } from "../doamin/entities/SubCategory";
import { ICategory } from "../doamin/entities/Category";
import { IFriendsLists } from "../doamin/entities/IFriendsLists";
import { IMessage } from "../doamin/entities/Message";
import { INotification } from "../infrastructure/database/models/NotificationModel";
import { IPaymentTransaction } from "../infrastructure/database/models/TransactionModel";
import { ReportRequestBody } from "../doamin/entities/Report";

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
    updateMessage(id: string, status: 'sent' | 'delivered' | 'read'): Promise<IMessage | null> 
    uploadAudio(audio:Buffer):Promise<any>
    saveAudio(senderId:string,receiverId:string,audio:string,messageId:string):Promise<any>
    saveImage(file:string,senderId:string,receiverId:string,messageId:string):Promise<any>
    saveNotification(senderId:string,receiverId:string,message:string,link:string,type:'message'|'payment'|'job'):Promise<INotification>
    getNotifications(id:string):Promise<INotification[]|null|undefined>
    changeNotificationStatus(notificationId:string,userId:string):Promise<void>
    transactionHistory(id:string,page:number,limit:number):Promise<{transaction:IPaymentTransaction[],totalPages:number}>
    reportUser(data:ReportRequestBody):Promise<ReportRequestBody |null>
}