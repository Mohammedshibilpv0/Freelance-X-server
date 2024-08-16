export interface IFreelancerGig {
    email?:string
    projectName: string;
    description: string;
    category: string;
    subcategory: string;
    deadline: string;
    searchTags: string[];
    images: string[];
    price: number | string;
    userId?:string
    createAt?:Date
  }