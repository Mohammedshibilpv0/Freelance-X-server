import { IFreelancerRepository } from "../../interface/IFreelancerRepository";
import { IFreelancerGig } from "../../doamin/entities/IFreelancerGig";
import { IUserRepository } from "../../interface/IUserRepository";

export default class ClientUseCase {
  private freelancerrepository: IFreelancerRepository;
  private userepository: IUserRepository;

  constructor(
    freelancerrepository: IFreelancerRepository,
    userepository: IUserRepository
  ) {
    this.freelancerrepository = freelancerrepository;
    this.userepository = userepository;
  }

  async createGig(
    data: IFreelancerGig
  ): Promise<IFreelancerGig | null | undefined> {
    if (data.email) {
      const checkUser = await this.userepository.findByEmail(data.email);
      const updatedData = { ...data, userId: checkUser?._id };
      const create = await this.freelancerrepository.createGig(updatedData);
      if (create == null) {
        return undefined;
      }
      return create;
    } else {
      return null;
    }
  }

  async listFreelancerWork(
    email: string
  ): Promise<IFreelancerGig[] | null | undefined> {
    if (email) {
      const checkUser = await this.userepository.findByEmail(email);
      if (checkUser && checkUser._id) {
        const getworks = await this.freelancerrepository.listFreelancerWork(
          checkUser._id
        );
        return getworks;
      }
      return null;
    }
    return undefined;
  }

  async findgig(id: string): Promise<IFreelancerGig | null> {
    const gig = await this.freelancerrepository.findGig(id);
    if (gig == null) {
      return gig;
    }
    return gig;
  }
}
