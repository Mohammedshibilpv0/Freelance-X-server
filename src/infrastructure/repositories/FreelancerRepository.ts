import { IFreelancerGig } from "../../doamin/entities/IFreelancerGig";
import mongoose from "mongoose";
import { IUserPost } from "../../doamin/entities/UserPost";
import { IFreelancerRepository } from "../../interface/IFreelancerRepository";
import FreelancerGig from "../database/models/FreelancerGigModal";

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export default class FreelancerRepository implements IFreelancerRepository {
  async createGig(data: IFreelancerGig): Promise<IFreelancerGig | null> {
    return await FreelancerGig.create(data);
  }

  async listFreelancerWork(id: string,page:number,limit:number): Promise< { posts: IFreelancerGig[], totalPages: number }> {

    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      FreelancerGig.find({userId: id}).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      FreelancerGig.countDocuments().exec()
    ]);
    const totalPages = Math.ceil(totalPosts / limit);
    return {posts,totalPages}
  }

  async findGig(id: string): Promise<IFreelancerGig | null> {
    if (!isValidObjectId(id)) {
      throw new Error(`Invalid Gig ID: ${id}`);
    }
    return await FreelancerGig.findById(id);
  }

 async allGigs(page:number,limit:number): Promise<{ posts: IFreelancerGig[], totalPages: number }> {
  const skip = (page - 1) * limit;
  const [posts, totalPosts] = await Promise.all([
    FreelancerGig.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    FreelancerGig.countDocuments().exec()
  ]);
  const totalPages = Math.ceil(totalPosts / limit);

  return {posts,totalPages}
 }
}
