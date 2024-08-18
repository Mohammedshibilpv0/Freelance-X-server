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

  async listUserPosts(id: string): Promise<IUserPost[] | null> {
    const posts = await UserPost.find({ userId: id }).exec();
    return posts.length > 0 ? posts : null;
  }
}
