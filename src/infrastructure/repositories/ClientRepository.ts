import { IUserPost, requestInterface } from "../../doamin/entities/UserPost";
import { IClientRepository } from "../../interface/IClientRepository";
import UserPost from "../database/models/UserPostModal";
import mongoose from "mongoose";

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export default class ClientRepository implements IClientRepository {
  async createPost(data: IUserPost): Promise<IUserPost> {
    data.requests=[]
    return UserPost.create(data);
  }

  async findPost(id: string): Promise<IUserPost | null> {
    if (!isValidObjectId(id)) {
      throw new Error(`Invalid post ID: ${id}`);
    }
    return await UserPost.findById(id).populate('category').populate('subcategory') .populate({
      path: 'requests.userId',
      select:'email firstName secondName',
      model: 'User' 
    });
      
  }

  async listUserPosts(id: string,page:number,limit:number): Promise<{ posts: IUserPost[], totalPages: number }> {

    const skip = (page - 1) * limit;
    const [posts, totalPosts] = await Promise.all([
      UserPost.find({ userId: id }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      UserPost.countDocuments().exec()
    ]);
    const totalPages = Math.ceil(totalPosts / limit);

    return {posts,totalPages}
  }

  async allPost(page:number,limit:number): Promise<{ posts: IUserPost[], totalPages: number }> {
    const skip = (page - 1) * limit;
    const [posts, totalPosts] = await Promise.all([
      UserPost.find({status:{$ne:"Approved"}}).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      UserPost.countDocuments().exec()
    ]);
    const totalPages = Math.ceil(totalPosts / limit);

    return {posts,totalPages}
  }

  async requestProject(data: requestInterface, id: string): Promise<IUserPost | null> {
    const updatedUserPost = await UserPost.findByIdAndUpdate(
      data.id,
      {
        $push: {
          requests: {
            message: data.message,
            userId: id,
            price:data.price,
            status:data.status
          }
        }
      },
      { new: true }
    );

    console.log(updatedUserPost)
    return updatedUserPost;
  }


  async changeStatus(id: string,status:string): Promise<IUserPost | null> {
    const userPost = await UserPost.findOneAndUpdate(
        { 'requests._id': id }, 
        { $set: { 'requests.$.status': status} },
        { new: true } 
    );

    if(status=='Approved' && userPost){
      userPost.status=status
      await userPost.save()
    }

    return userPost;
}

}
