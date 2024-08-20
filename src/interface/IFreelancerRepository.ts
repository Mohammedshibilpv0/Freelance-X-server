import { IFreelancerGig } from "../doamin/entities/IFreelancerGig";

export interface IFreelancerRepository{
    
    createGig(data:IFreelancerGig):Promise<IFreelancerGig|null>
    listFreelancerWork(id:string,page:number,limit:number):Promise<{ posts: IFreelancerGig[], totalPages: number }>
    findGig(id:string):Promise<IFreelancerGig|null>
    allGigs(page:number,limit:number):Promise<{ posts:IFreelancerGig[], totalPages: number }>
}