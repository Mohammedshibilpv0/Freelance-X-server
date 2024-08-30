import { IFreelancerRepository } from "../../interface/IFreelancerRepository";
import { IFreelancerGig } from "../../doamin/entities/IFreelancerGig";
import { IUserRepository } from "../../interface/IUserRepository";
import { IUserPost } from "../../doamin/entities/UserPost";

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
    email: string,page:number,limit:number
  ): Promise<{ posts: IFreelancerGig[], totalPages: number }| null | undefined> {
    if (email) {
      const checkUser = await this.userepository.findByEmail(email);
      if (checkUser && checkUser._id) {
        const {posts,totalPages} = await this.freelancerrepository.listFreelancerWork(
          checkUser._id,page,limit
        );
        return {posts,totalPages};
      }
      return null;
    }
    return undefined;
  }

  async findgig(id: string,isRequest:boolean): Promise<IFreelancerGig | IUserPost|null> {
    const gig = await this.freelancerrepository.findGig(id,isRequest);
    if (gig == null) {
      return gig;
    }
    return gig;
  }

  async allGigs(page:number,limit:number):Promise<{ posts: IFreelancerGig[], totalPages: number }>{
    const {posts,totalPages}= await this.freelancerrepository.allGigs(page,limit)
    return{ posts,totalPages}
  }

  async  requestProject (email:string,id:string,message:string,amount:string){
    const user= await this.userepository.findByEmail(email)

    if(user==null){
      return user
    }
    const status='Pending'
    const price =parseInt(amount)
    const request= await this.freelancerrepository.requestProject({id,message,price,status},(user._id ?? ""))
    return request
  }


  async changeProjectStatus (id:string,status:string):Promise<IFreelancerGig|null>{
    return await this.freelancerrepository.changeStatus(id,status)
   }


   async myRequests (email:string,page:number,limit:number): Promise<{ posts: IUserPost[], totalPages: number }| null | undefined>{
    if(email){
      const checkUser = await this.userepository.findByEmail(email);
      if (checkUser && checkUser._id) {
        const {posts,totalPages} = await this.freelancerrepository.listMyRequests(
          checkUser._id,page,limit
        );
        return {posts,totalPages};
      }
      return null;
    }
    return undefined;
  }

  async myApproved (email:string,page:number,limit:number): Promise<{ posts: IUserPost[], totalPages: number }| null | undefined>{
    if(email){
      const checkUser = await this.userepository.findByEmail(email);
      if (checkUser && checkUser._id) {
        const {posts,totalPages} = await this.freelancerrepository.listApproved(
          checkUser._id,page,limit
        );
        return {posts,totalPages};
      }
      return null;
    }
    return undefined;
  }


  async setProjectModule (id:string,data:object):Promise<IUserPost|null>{
    return  await this.freelancerrepository.setModuleClientPost(id,data)
  }
  async setProjectModuleFreelancer (id:string,data:object):Promise<IFreelancerGig|null>{
    return await this.freelancerrepository.setModuleFreelancerPost(id,data)
  }

}
