import { ICategory } from "../../doamin/entities/Category";
import { ISubcategory } from "../../doamin/entities/SubCategory";
import AdminRepository from "../../infrastructure/repositories/AdminRepository";

interface EditCategoryResponse {
  message: string;
  editCategory?: object;
  editSubCategory?:object
}

interface AddCategoryResult {
  message?: string;
  category?: ICategory; 
  error?: string;
}


type EditCategoryResult = EditCategoryResponse | string;

export default class CategoryUseCase {
  private adminrepository: AdminRepository;

  constructor(adminrepository: AdminRepository) {
    this.adminrepository = adminrepository;
  }

  async addCategory(name: string, description: string): Promise<AddCategoryResult> {
    const checkCategoryExists = await this.adminrepository.findcategory(name);
    
    if (checkCategoryExists.length > 0) {      
      return { error: "Category Already Exists" };
    }
    const addCategory = await this.adminrepository.addCategory(name, description);
    if (addCategory) {
      return { message: "Category created successfully", category: addCategory };
    }
  
    return { error: "An unknown error occurred" };
  }

  async listCategories():Promise<ICategory[]|string>{

    const categories=await  this.adminrepository.categories()
    return categories
    
  }

  async findCategory(categoryId:string):Promise<ICategory|null>{
    const findCategory = await this.adminrepository.findCategoryById(categoryId)    
    return findCategory
  }

  async  editCategory(categoryId: string, name: string, description: string): Promise<EditCategoryResult> {
    const findCategoryAlready = await this.adminrepository.findcategory(name);
  
    const isDuplicate = findCategoryAlready.some(category => category.name === name && category._id !== categoryId);   
    if (isDuplicate) {
      return 'Category Already Exists';
    } else { 
      let editCategory = await this.adminrepository.editCategory(categoryId, name, description);
      if (editCategory) {
        return { message: 'edited successfully', editCategory };
      } else {
        return 'Category is not found';
      }
    }
  }


  async deleteCategory(categoryId:string):Promise<ICategory|null>{
    const deleteCategory=await this.adminrepository.deleteCategory(categoryId)
    return deleteCategory
  }  

  async addSubCategory(name:string,description:string,category:string):Promise<ISubcategory|undefined>{
    const addSubCategory=await this.adminrepository.addSubcategory({name,description,category})
    if(addSubCategory){
      return addSubCategory
    }
    return undefined
  }

  
  async getSubCategories(): Promise<ISubcategory [] | undefined> {
    const subCategories = await this.adminrepository.subCategories();

    if (subCategories.length === 0) {
      return undefined;
    }
  
    
    
    // const formattedSubCategories = subCategories.map(subCategory => ({
    //   _id:subCategory._id,
    //   name: subCategory.name,
    //   description: subCategory.description,
    //   category: subCategory.category && typeof subCategory.category === 'object' 
    //     ? subCategory.category.name 
    //     : 'Unknown Category'
    // }));
    return subCategories;
  }
  

  async getSubCategoryById(categoryId:string):Promise<ISubcategory|null>{
    const findSubCategory = await this.adminrepository.findSubCategoryById(categoryId)    
    return findSubCategory
  }

  async  editSubCategory(subCategoryId: string, subCategoryData:ISubcategory): Promise<EditCategoryResult> {
    const findSubCategoryAlready = await this.adminrepository.findSubCategory(subCategoryData.name);
  
     const isDuplicate = findSubCategoryAlready.some(
    (category) => {

      category.name === subCategoryData.name && category._id !== subCategoryId}
  );

  
      if (isDuplicate) {
      return 'Subcategory Already Exists';
    } else { 
      let editSubCategory = await this.adminrepository.editSubCategory(subCategoryId, subCategoryData);
      if (editSubCategory) {
        return { message: 'edited successfully', editSubCategory };
      } else {
        return 'Subcategory is not found';
      }
    }
  }


  async deleteSubCategory(subCategoryId:string):Promise<ISubcategory|null>{
    const deleteCategory=await this.adminrepository.deleteSubCategory(subCategoryId)
    return deleteCategory
  }

}
