import { IFreelancerGig, requestInterface } from "../doamin/entities/IFreelancerGig";
import { IUserPost } from "../doamin/entities/UserPost";

export interface IFreelancerRepository{
    
    createGig(data:IFreelancerGig):Promise<IFreelancerGig|null>
    listFreelancerWork(id:string,page:number,limit:number):Promise<{ posts: IFreelancerGig[], totalPages: number }>
    findGig(id:string,isRequest:boolean):Promise<IFreelancerGig|IUserPost|null>
    allGigs(page:number,limit:number):Promise<{ posts:IFreelancerGig[], totalPages: number }>
    requestProject(data:requestInterface,id:string):Promise<IFreelancerGig |null>
    changeStatus(id:string,status:string):Promise<IFreelancerGig|null>   
    listMyRequests(id:string,page:number,limit:number):Promise<{ posts: IUserPost[], totalPages: number }>
    listApproved(id:string,page:number,limit:number):Promise<{ posts: IUserPost[], totalPages: number }>
    setModuleClientPost(id:string,data:object):Promise<IUserPost|null>
    setModuleFreelancerPost(id:string,data:object):Promise<IFreelancerGig|null>
}