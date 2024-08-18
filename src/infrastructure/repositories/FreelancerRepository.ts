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

  async listFreelancerWork(id: string): Promise<IFreelancerGig[] | null> {
    const gigs = await FreelancerGig.find({ userId: id }).exec();
    return gigs.length > 0 ? gigs : null;
  }

  async findGig(id: string): Promise<IFreelancerGig | null> {
    if (!isValidObjectId(id)) {
      throw new Error(`Invalid Gig ID: ${id}`);
    }
    return await FreelancerGig.findById(id);
  }
}
