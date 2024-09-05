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
    });

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

    const friends = conversations.map(conversation => {
      const friendId = conversation.user1.equals(userId) ? conversation.user2 : conversation.user1;
      const friend = userMap.get(friendId.toString());

      return {
        id: friendId.toString(),
        firstName: friend?.firstName || '',
        lastName: friend?.secondName || '',  
        conversationId:conversation.id.toString()
      };
    });
    return {friends};
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

async  setNotification(senderId: string, receiverId: string, text: string): Promise<INotification | null> {
    try {
        const notification: INotification = {
            time: new Date(),
            senderId: new mongoose.Types.ObjectId(senderId),
            receiverId: new mongoose.Types.ObjectId(receiverId),
            content: text,
        };

        const newNotification = new Notification(notification);
        const savedNotification = await newNotification.save();
        return savedNotification;
    } catch (error) {
        console.error('Error setting notification:', error);
        return null;
    }
}


async updateMessage(id: string, status: 'sent' | 'delivered' | 'read'): Promise<IMessage | null> {
    try {
        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            { status },
            { new: true } 
        ) as IMessage | null;

        return updatedMessage;
    } catch (err) {
        console.error('Error updating message:', err);
        return null;
    }
}



}