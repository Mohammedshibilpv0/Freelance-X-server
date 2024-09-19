import mongoose,{Types} from 'mongoose';
import UserModel from "../database/models/UserModel";
import SubCategory from '../database/models/Subcategory';
import { IUserRepository } from "../../interface/IUserRepository";
import { IUser } from "../../doamin/entities/User";
import { IOtp } from "../../doamin/entities/Otp"
import OtpModel from "../database/models/OtpModel";
import { ISubcategory } from '../../doamin/entities/SubCategory';
import { ICategory } from '../../doamin/entities/Category';
import Category from '../database/models/CategoryModel';
import Conversation from '../database/models/Conversation';
import Message from '../database/models/Message';
import { IFriend, IFriendsLists } from '../../doamin/entities/IFriendsLists';
import { IMessage } from '../../doamin/entities/Message';
import Notification, { INotification } from '../database/models/NotificationModel';
import { bucket } from '../../utils/firebase'; 
import PaymentTransaction, { IPaymentTransaction } from '../database/models/TransactionModel';
import { ReportRequestBody } from '../../doamin/entities/Report';
import Report from '../database/models/ReportModel';
import { time } from 'console';
const { v4: uuidv4 } = require('uuid');

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
        if (!isValidObjectId(id)) {
            throw new Error(`Invalid User ID: ${id}`);
        }   
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

    
    async categories(): Promise<ICategory[]|null> {
        try{
            return await Category.find()
        }catch(err){
            return null;
        }
    }


    async saveMessage(senderId: string, receiverId: string, message: string,initial=false,messageId:string): Promise<any|null> {
        try{
            let conversation = await Conversation.findOne({
                $or: [
                    { user1: senderId, user2: receiverId },
                    { user1: receiverId, user2: senderId },
                ],
            });
    
            if (!conversation) {
                conversation = await Conversation.create({ user1: senderId, user2: receiverId });
            }
            if(conversation){
                await Conversation.findOneAndUpdate({
                    $or: [
                        { user1: senderId, user2: receiverId },
                        { user1: receiverId, user2: senderId },
                    ]},
                    {updatedAt:Date.now(),
                    lastMessage:message,
                    }
                )
            }
            const newMessage = await Message.create({
                conversationId: conversation._id,
                sender: senderId,
                text: message,
                timestamp: new Date(),
                messageId:messageId
            });
            if(initial==true){
                
                return conversation
            }
    
            return newMessage;
        }catch(err){
            return null
        }
    }




async findUsersConnections(id: string): Promise<IFriendsLists|null> {
    try {
      const userId = new Types.ObjectId(id);
  
      const conversations = await Conversation.find({
        $or: [{ user1: userId }, { user2: userId }],
      }).sort({ updatedAt: -1 });
  
      if (!conversations.length) {
        return null;
      }
  
      const userIds = new Set(
        conversations.flatMap(conversation =>
          [conversation.user1, conversation.user2].filter(uid => !uid.equals(userId))
        )
      );
  
      const users = await UserModel.find({ _id: { $in: Array.from(userIds) } });
      const userMap = new Map(users.map(user => [user._id.toString(), user]));
  
      const friends = await Promise.all(conversations.map(async conversation => {
        const friendId = conversation.user1.equals(userId) ? conversation.user2 : conversation.user1;
        const friend = userMap.get(friendId.toString());
  
        const unseenMessagesCount = await Message.countDocuments({
          conversationId: conversation._id,
          sender: { $ne: userId },
          status: { $ne: 'read' }
        });
  
        return {
          id: friendId.toString(),
          firstName: friend?.firstName || '',
          lastName: friend?.secondName || '',
          conversationId: conversation.id.toString(),
          updatedAt: conversation.updatedAt,
          lastMessage: conversation.lastMessage,
          unseenMessagesCount 
        };
      }));
  
      return { friends };
    } catch (err) {
      return null;
    }
  }
  

async getMessages(conversationId : string): Promise<IMessage[] | null> {
    if (!isValidObjectId(conversationId)) {
        throw new Error(`Invalid conversation ID: ${conversationId}`);
    }   
    return Message.find({conversationId})
}




async updateMessage(messageId: string, status: 'sent' | 'delivered' | 'read'): Promise<IMessage | null> {
    try {
        const updatedMessage = await Message.findOneAndUpdate(
            {messageId},
            { status },
            { new: true } 
        ) as IMessage | null;

        return updatedMessage;
    } catch (err) {
        console.error('Error updating message:', err);
        return null;
    }
}

async uploadAudio(audio: Buffer): Promise<string | null> {
    try {
      const fileName = `${uuidv4()}.wav`;
      const blob = bucket.file(`audio-messages/${fileName}`);
  
      return new Promise((resolve, reject) => {
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: 'audio/wav',
          },
        });
  
        blobStream.on('error', (err) => {
          console.error('Error uploading audio file:', err);
          reject(err);  
        });
  
        blobStream.on('finish', () => {
          const encodedFileName = encodeURIComponent(fileName);
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/audio-messages%2F${encodedFileName}?alt=media`;
  
          resolve(publicUrl);
        });
  
        blobStream.end(audio); 
      });
  
    } catch (err) {
      console.error('Error in uploadAudio function:', err);
      return null;
    }
  }
  


  async saveAudio(senderId: string, receiverId: string, audio: string, messageId: string): Promise<any> {
    try{
        let conversation = await Conversation.findOne({
            $or: [
                { user1: senderId, user2: receiverId },
                { user1: receiverId, user2: senderId },
            ],
        });

        if (!conversation) {
            conversation = await Conversation.create({ user1: senderId, user2: receiverId });
        }
        if(conversation){
            await Conversation.findOneAndUpdate({
                $or: [
                    { user1: senderId, user2: receiverId },
                    { user1: receiverId, user2: senderId },
                ]},
                {updatedAt:Date.now(),
                lastMessage:'Sent Voice message',
                }
            )
        }
        const newMessage = await Message.create({
            conversationId: conversation._id,
            sender: senderId,
            audio: audio,
            timestamp: new Date(),
            messageId:messageId
        });

        return newMessage;
    }catch(err){
        console.log(err)
    }
  }

  async saveImage(file: string, senderId: string, receiverId: string, messageId: string): Promise<any> {
    try{
        let conversation = await Conversation.findOne({
            $or: [
                { user1: senderId, user2: receiverId },
                { user1: receiverId, user2: senderId },
            ],
        });

        if (!conversation) {
            conversation = await Conversation.create({ user1: senderId, user2: receiverId });
        }
        if(conversation){
            await Conversation.findOneAndUpdate({
                $or: [
                    { user1: senderId, user2: receiverId },
                    { user1: receiverId, user2: senderId },
                ]},
                {updatedAt:Date.now(),
                lastMessage:'image',
                }
            )
        }
        const newMessage = await Message.create({
            conversationId: conversation._id,
            sender: senderId,
            file: file,
            timestamp: new Date(),
            messageId:messageId
        });

        return newMessage;
    }catch(err){
        return null
    }
  }

  async saveNotification(senderId: string, receiverId: string, message: string, link: string,type:'message'|'payment'|'job'): Promise<INotification> {
    return await Notification.create({senderId,receiverId,message,link,type})
}
async getNotifications(id: string): Promise<INotification[] | null | undefined> { 
    try {
       return await Notification.find({
        receiverId: id,
        $or: [
            { type: { $ne: 'message' } }, // Include all notifications that are not of type 'message'
            { type: 'message', read: false }, // Include 'message' notifications that are unread
          ],
      }).sort({time:-1})
    } catch (err) {
      return null;
    }
  }
  

  async changeNotificationStatus(notificationId: string, userId: string): Promise<void> {
    await Notification.updateOne(
        { _id: notificationId, receiverId: userId },
        { $set: { read: true } }
      );
  }

  async transactionHistory(id: string, page: number, limit: number): Promise<{ transaction: IPaymentTransaction[], totalPages: number }> {
    try {
        const skip = (page - 1) * limit;

        const [transaction, totalCount] = await Promise.all([
            PaymentTransaction.find({
                $or: [
                    { senderId: id },
                    { receiverId: id }
                ]
            })
            .select('_id senderId createdAt amount')
            .populate({
                path: 'senderId',
                select: 'firstName secondName' 
            })
            .populate({
                path: 'receiverId',
                select: 'firstName secondName'
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec(),
            PaymentTransaction.countDocuments({
                $or: [
                    { senderId: id },
                    { receiverId: id }
                ]
            }).exec()
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return { transaction, totalPages };
    } catch (error) {
        throw error;   
    }
}

async  reportUser(data: ReportRequestBody): Promise<ReportRequestBody | null> {
    try {
      if (data.customReason) {
        data.reason = 'Other';
      }
  
      const report = await Report.create(data);
  
      return {
        reportedUserId: report.reportedUserId.toString(),
        reporterUserId: report.reporterUserId.toString(),
        reason: report.reason,
        customReason: report.customReason || '', 
      };
    } catch (error) {
      console.error('Error creating report:', error);
      return null;
    }
  }
  

}