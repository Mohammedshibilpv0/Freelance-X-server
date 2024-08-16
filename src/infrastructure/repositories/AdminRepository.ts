import UserModel from "../database/models/UserModel";
import mongoose from 'mongoose';
import { IUserSummary } from "../../doamin/entities/User";
import { IAdminRepository } from "../../interface/IAdminRepository";
import { ICategory } from "../../doamin/entities/Category";
import Category from "../database/models/CategoryModel";
import SubCategory from "../database/models/Subcategory";
import { ISubcategory } from "../../doamin/entities/SubCategory";

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export default class AdminRepository implements IAdminRepository {
  async findUsers(): Promise<IUserSummary[]> {
    return await UserModel.find(
      { isAdmin: { $ne: true } },
      "email firstName secondName isBlock country createAt -_id"
    );
  }

  async addCategory(name: string, description: string): Promise<ICategory> {
    return await Category.create({ name, description });
  }

  async findcategory(name: string): Promise<ICategory[]> {
    return await Category.find({ name });
  }

  async categories(): Promise<ICategory[]> {
      return await Category.find()
  }
  
  async findCategoryById(categoryId: string): Promise<ICategory|null> {
    return await Category.findById(categoryId)
  }

  async editCategory(categoryId: string, name: string, description: string): Promise<ICategory|null> {
    if (!isValidObjectId(categoryId)) {
      throw new Error(`Invalid category ID: ${categoryId}`);
    }
    return await Category.findByIdAndUpdate(categoryId,{name,description})
  }

  async deleteCategory(categoryId: string): Promise<ICategory | null> {
    if (!isValidObjectId(categoryId)) {
      throw new Error(`Invalid category ID: ${categoryId}`);
    }
    const deletedCategory = await Category.findByIdAndUpdate(categoryId, { isDeleted: true });
  
     if (deletedCategory) {
      await SubCategory.updateMany(
        { category: categoryId },
        { isDeleted: true }
      );
    }
  
    return deletedCategory;
  }

  async addSubcategory(subcategory:ISubcategory): Promise<ISubcategory | null> {
    return await SubCategory.create(subcategory)
  }

  async subCategories(): Promise<ISubcategory[]> {
    return await SubCategory.find()
  }

  async findSubCategoryById(subCategoryId: string): Promise<ISubcategory | null> {
    if(!isValidObjectId(subCategoryId)){
      throw new Error(`Invalid category ID: ${subCategoryId}`)
    }
    return await SubCategory.findById(subCategoryId).populate('category');
  }

  async editSubCategory(subCategoryId: string, subCategoryData: ISubcategory): Promise<ISubcategory | null> {
    if(!isValidObjectId(subCategoryId)){
      throw new Error(`Invalid category ID: ${subCategoryId}`)
    }
    return await SubCategory.findByIdAndUpdate(subCategoryId,subCategoryData)
  }

  async findSubCategory(name: string): Promise<ISubcategory[]> {
    return await SubCategory.find({name})
  }

  async deleteSubCategory(subCategoryId: string): Promise<ISubcategory | null> {
    if(!isValidObjectId(subCategoryId)){
      throw new Error(`Invalid category ID: ${subCategoryId}`)
    }
    return await SubCategory.findByIdAndUpdate(subCategoryId,{isDeleted:true})
  }
}
