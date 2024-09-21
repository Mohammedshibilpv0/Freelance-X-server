import { IUserSummary } from "../doamin/entities/User";
import { ICategory } from "../doamin/entities/Category";
import { ISubcategory } from "../doamin/entities/SubCategory";
import { IUserPost } from "../doamin/entities/UserPost";
import { IFreelancerGig } from "../doamin/entities/IFreelancerGig";
import { ReportRequestBody } from "../doamin/entities/Report";
import { IReport } from "../infrastructure/database/models/ReportModel";

export interface IAdminRepository {
    findUsers(page:number,limit:number):Promise<{users:IUserSummary[],totalPages:number}>
    addCategory(name:string,description:string,image:string):Promise<ICategory>
    findcategory(name:string):Promise<ICategory[]>
    categories(page:number,limit:number):Promise<{category:ICategory[],totalPages:number}>
    findCategoryById(categoryId:string):Promise<ICategory|null>
    editCategory(categoryId:string,name:string,description:string,image:string|undefined):Promise<ICategory|null>
    deleteCategory(categoryId:string):Promise<ICategory|null>
    findSubCategory(name:string):Promise<ISubcategory[]> 
    addSubcategory(subcategory:ISubcategory):Promise<ISubcategory|null>
    findAlreadyCategory(name:string):Promise<ICategory|null>
    subCategories(page:number,limit:number):Promise<{subCategory:ISubcategory[],totalPages:number}>
    findSubCategoryById(subCategoryId:string):Promise<ISubcategory|null>
    editSubCategory(subCategoryId:string,subCategoryData:ISubcategory):Promise<ISubcategory|null>
    deleteSubCategory(subCategoryId:string):Promise<ISubcategory|null>
    userPosts(page:number,limit:number):Promise<{userPosts:IUserPost[],totalPages:number}>
    handleBlockUserPost(proId:string,status:boolean):Promise<IUserPost|null>
    handleBlockGig(proId:string,status:boolean):Promise<IFreelancerGig|null>
    freelancerGig(page:number,limit:number):Promise<{userPosts:IFreelancerGig[],totalPages:number}>
    getReports(page:number,limit:number):Promise<{reports:IReport[],totalPages:number}|undefined>
    dashboard():Promise<any[]>
}