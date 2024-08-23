import { IUserSummary } from "../doamin/entities/User";
import { ICategory } from "../doamin/entities/Category";
import { ISubcategory } from "../doamin/entities/SubCategory";

export interface IAdminRepository {
    findUsers(page:number,limit:number):Promise<{users:IUserSummary[],totalPages:number}>
    addCategory(name:string,description:string):Promise<ICategory>
    findcategory(name:string):Promise<ICategory[]>
    categories(page:number,limit:number):Promise<{category:ICategory[],totalPages:number}>
    findCategoryById(categoryId:string):Promise<ICategory|null>
    editCategory(categoryId:string,name:string,description:string):Promise<ICategory|null>
    deleteCategory(categoryId:string):Promise<ICategory|null>
    findSubCategory(name:string):Promise<ISubcategory[]> 
    addSubcategory(subcategory:ISubcategory):Promise<ISubcategory|null>
    subCategories(page:number,limit:number):Promise<{subCategory:ISubcategory[],totalPages:number}>
    findSubCategoryById(subCategoryId:string):Promise<ISubcategory|null>
    editSubCategory(subCategoryId:string,subCategoryData:ISubcategory):Promise<ISubcategory|null>
    deleteSubCategory(subCategoryId:string):Promise<ISubcategory|null>
    
}