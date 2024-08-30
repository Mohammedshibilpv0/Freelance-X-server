import { IFreelancerGig } from "../doamin/entities/IFreelancerGig";
import { IUserPost } from "../doamin/entities/UserPost";
import { requestInterface } from "../doamin/entities/UserPost";

export interface IClientRepository{
    
    createPost(data:IUserPost):Promise<IUserPost>
    listUserPosts(id:string,page:number,limit:number):Promise<{ posts: IUserPost[], totalPages: number }>
    findPost(id:string,isRequest:boolean):Promise<IFreelancerGig|IUserPost|null>
    allPost(page:number,limit:number):Promise<{ posts: IUserPost[], totalPages: number }>
    requestProject(data:requestInterface,id:string):Promise<IUserPost |null>
    changeStatus(id:string,status:string):Promise<IUserPost|null>
    listMyRequests(id:string,page:number,limit:number):Promise<{ posts: IFreelancerGig[], totalPages: number }>
    listApproved(id:string,page:number,limit:number):Promise<{ posts: IFreelancerGig[], totalPages: number }>
    successPayment(token:string,id:string,amount:string,isPost:string):Promise<any>
}