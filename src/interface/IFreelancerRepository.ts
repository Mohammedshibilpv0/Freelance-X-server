import { IFreelancerGig } from "../doamin/entities/IFreelancerGig";

export interface IFreelancerRepository{
    
    createGig(data:IFreelancerGig):Promise<IFreelancerGig|null>
    listFreelancerWork(id:string):Promise<IFreelancerGig[]|null>
    findGig(id:string):Promise<IFreelancerGig|null>
}