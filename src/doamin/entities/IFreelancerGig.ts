export interface IFreelancerGig {
    email?:string
    projectName: string;
    description: string;
    category: string;
    status?:string
    subcategory: string;
    deadline: string;
    requests?:requestInterface[]
    searchTags: string[];
    images: string[];
    price: number | string;
    userId?:string
    createAt?:Date
  }


  export interface requestInterface{
    id?:string
    message:string,
    price:number,
    userId?:string
    status?:string
}