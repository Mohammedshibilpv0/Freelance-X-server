import { IFreelancerGig, requestInterface } from "../doamin/entities/IFreelancerGig";

export interface IFreelancerRepository{
    
    createGig(data:IFreelancerGig):Promise<IFreelancerGig|null>
    listFreelancerWork(id:string,page:number,limit:number):Promise<{ posts: IFreelancerGig[], totalPages: number }>
    findGig(id:string):Promise<IFreelancerGig|null>
    allGigs(page:number,limit:number):Promise<{ posts:IFreelancerGig[], totalPages: number }>
    requestProject(data:requestInterface,id:string):Promise<IFreelancerGig |null>
    changeStatus(id:string,status:string):Promise<IFreelancerGig|null>
}