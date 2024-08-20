import { IUserPost } from "../../doamin/entities/UserPost";
import { IClientRepository } from "../../interface/IClientRepository";
import UserPost from "../database/models/UserPostModal";
import mongoose from "mongoose";

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export default class ClientRepository implements IClientRepository {
  async createPost(data: IUserPost): Promise<IUserPost> {
    return UserPost.create(data);
  }

  async findPost(id: string): Promise<IUserPost | null> {
    if (!isValidObjectId(id)) {
      throw new Error(`Invalid post ID: ${id}`);
    }
     return await UserPost.findById(id).populate('category').populate('subcategory')
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
      UserPost.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      UserPost.countDocuments().exec()
    ]);
    const totalPages = Math.ceil(totalPosts / limit);

    return {posts,totalPages}
  }
}
