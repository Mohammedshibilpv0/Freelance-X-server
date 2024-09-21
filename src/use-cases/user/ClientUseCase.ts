import { IClientRepository } from "../../interface/IClientRepository";
import { IUserRepository } from "../../interface/IUserRepository";
import { IUserPost } from "../../doamin/entities/UserPost";
import { IFreelancerGig } from "../../doamin/entities/IFreelancerGig";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import ClientRepository from "../../infrastructure/repositories/ClientRepository";
import { deepStrictEqual } from "assert";

export default class ClientUseCase {
  private clientrepository: IClientRepository;
  private userepository: IUserRepository;

  constructor(
    clientrepository: IClientRepository,
    userepository: IUserRepository
  ) {
    this.clientrepository = clientrepository;
    this.userepository = userepository;
  }

  async userPost(data: IUserPost): Promise<IUserPost | undefined | null> {
    
    if (data.email) {
      const checkUser = await this.userepository.findByEmail(data.email);
      const updatedData = { ...data, userId: checkUser?._id };
      const addPost = await this.clientrepository.createPost(updatedData);
      if (addPost == null) {
        return undefined;
      }
      return addPost;
    } else {
      return null;
    }
  }

  async editPost(id:string,data:IUserPost): Promise<IUserPost | undefined | null>{
    try{
      return await this.clientrepository.editPost(id,data)
    }catch(er){
      return null
    }
  }


  async findPost(id:string,isRequest:boolean):Promise<IUserPost|IFreelancerGig|null>{
    const post=await this.clientrepository.findPost(id,isRequest)
    return post
  }

  async listposts (email:string,page:number,limit:number): Promise<{ posts: IUserPost[], totalPages: number }| null | undefined>{
    if (email) {
      const checkUser = await this.userepository.findByEmail(email);
      if (checkUser && checkUser._id) {
        const {posts,totalPages} = await this.clientrepository.listUserPosts(
          checkUser._id,page,limit
        );
        return {posts,totalPages};
      }
      return null;
    }
    return undefined;
  }

  async allPosts (page:number,limit:number,searchKey:string,sortBy:string,sortOrder:string,category:string,subcategory:string):Promise<{ posts: IUserPost[], totalPages: number }>{
    const {posts,totalPages}=await this.clientrepository.allPost(page,limit,searchKey,sortBy,sortOrder,category,subcategory)
    return {posts,totalPages}
  }

 

  
  async  requestProject (email:string,id:string,message:string,amount:string){
    const user= await this.userepository.findByEmail(email)

    if(user==null){
      return user
    }
    const status='Pending'
    const price =parseInt(amount)
    const request= await this.clientrepository.requestProject({id,message,price,status},(user._id ?? ""))
    return request
  }

  async changeProjectStatus (id:string,status:string,amount:number):Promise<IUserPost|null>{
   return await this.clientrepository.changeStatus(id,status,amount)
  }

  async myRequests (email:string,page:number,limit:number): Promise<{ posts: IFreelancerGig[], totalPages: number }| null | undefined>{
    if(email){
      const checkUser = await this.userepository.findByEmail(email);
      if (checkUser && checkUser._id) {
        const {posts,totalPages} = await this.clientrepository.listMyRequests(
          checkUser._id,page,limit
        );
        return {posts,totalPages};
      }
      return null;
    }
    return undefined;
  }
    
  async myApproved (email:string,page:number,limit:number): Promise<{ posts: IFreelancerGig[], totalPages: number }| null | undefined>{
    if(email){
      const checkUser = await this.userepository.findByEmail(email);
      if (checkUser && checkUser._id) {
        const {posts,totalPages} = await this.clientrepository.listApproved(
          checkUser._id,page,limit
        );
        return {posts,totalPages};
      }
      return null;
    }
    return undefined;
  }

  async successPayment (token:string,id:string,amount:string,isPost:string){
    return this.clientrepository.successPayment(token,id,amount,isPost)

  }

  async deleteProject (projectId:string):Promise<IUserPost|null>{
    const deleteProject=await this.clientrepository.deleteProject(projectId)
    return deleteProject
  }


}
