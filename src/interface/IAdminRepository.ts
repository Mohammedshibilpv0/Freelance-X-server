import { IUserSummary } from "../doamin/entities/User";
import { ICategory } from "../doamin/entities/Category";
import { ISubcategory } from "../doamin/entities/SubCategory";

export interface IAdminRepository {
    findUsers():Promise<IUserSummary[]>
    addCategory(name:string,description:string):Promise<ICategory>
    findcategory(name:string):Promise<ICategory[]>
    categories():Promise<ICategory[]>
    findCategoryById(categoryId:string):Promise<ICategory|null>
    editCategory(categoryId:string,name:string,description:string):Promise<ICategory|null>
    deleteCategory(categoryId:string):Promise<ICategory|null>
    findSubCategory(name:string):Promise<ISubcategory[]> 
    addSubcategory(subcategory:ISubcategory):Promise<ISubcategory|null>
    subCategories():Promise<ISubcategory[]>
    findSubCategoryById(subCategoryId:string):Promise<ISubcategory|null>
    editSubCategory(subCategoryId:string,subCategoryData:ISubcategory):Promise<ISubcategory|null>
    deleteSubCategory(subCategoryId:string):Promise<ISubcategory|null>
    
}