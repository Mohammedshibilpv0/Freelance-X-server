import UserModel from "../database/models/UserModel";
import mongoose from "mongoose";
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
  
  async findUsers(page: number, limit: number): Promise<{ users: IUserSummary[]; totalPages: number; }> {
    const skip = (page - 1) * limit;
    const [users, totalPosts] = await Promise.all([
      UserModel.find(
        { isAdmin: { $ne: true } },
        "email firstName secondName isBlock country createAt -_id"
      )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() 
        .exec() as Promise<IUserSummary[]>, 
      UserModel.countDocuments({ isAdmin: { $ne: true } }).exec(),
    ]);
    const totalPages = Math.ceil(totalPosts / limit);
  
    return { users, totalPages };
  }

  async addCategory(name: string, description: string): Promise<ICategory> {
    return await Category.create({ name, description });
  }

  async findcategory(name: string): Promise<ICategory[]> {
    return await Category.find({ name });
  }

  async categories(page: number, limit: number): Promise<{ category: ICategory[]; totalPages: number; }> {
    const skip = (page - 1) * limit;
    const [category, totalPosts] = await Promise.all([
      Category.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() 
        .exec() as Promise<ICategory[]>, 
      Category.countDocuments({ isDeleted: { $ne: true } }).exec(),
    ]);
    const totalPages = Math.ceil(totalPosts / limit);
    return { category, totalPages };
  }

  async findCategoryById(categoryId: string): Promise<ICategory | null> {
    return await Category.findById(categoryId);
  }

  async editCategory(
    categoryId: string,
    name: string,
    description: string
  ): Promise<ICategory | null> {
    if (!isValidObjectId(categoryId)) {
      throw new Error(`Invalid category ID: ${categoryId}`);
    }
    return await Category.findByIdAndUpdate(categoryId, { name, description });
  }

  async deleteCategory(categoryId: string): Promise<ICategory | null> {
    if (!isValidObjectId(categoryId)) {
      throw new Error(`Invalid category ID: ${categoryId}`);
    }
    const deletedCategory = await Category.findByIdAndUpdate(categoryId, {
      isDeleted: true,
    });

    if (deletedCategory) {
      await SubCategory.updateMany(
        { category: categoryId },
        { isDeleted: true }
      );
    }

    return deletedCategory;
  }

  async addSubcategory(
    subcategory: ISubcategory
  ): Promise<ISubcategory | null> {
    return await SubCategory.create(subcategory);
  }

 async subCategories(page: number, limit: number): Promise<{ subCategory: ISubcategory[]; totalPages: number; }> {
  const skip = (page - 1) * limit;
  console.log(limit)
  const [subCategory, totalPosts] = await Promise.all([
    SubCategory.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean() 
      .exec() as Promise<ISubcategory[]>, 
      SubCategory.countDocuments({ isDeleted: { $ne: true } }).exec(),
  ]);
  const totalPages = Math.ceil(totalPosts / limit);
  return { subCategory, totalPages };
 }

  async findSubCategoryById(
    subCategoryId: string
  ): Promise<ISubcategory | null> {
    if (!isValidObjectId(subCategoryId)) {
      throw new Error(`Invalid category ID: ${subCategoryId}`);
    }
    return await SubCategory.findById(subCategoryId).populate("category");
  }

  async editSubCategory(
    subCategoryId: string,
    subCategoryData: ISubcategory
  ): Promise<ISubcategory | null> {
    if (!isValidObjectId(subCategoryId)) {
      throw new Error(`Invalid category ID: ${subCategoryId}`);
    }
    return await SubCategory.findByIdAndUpdate(subCategoryId, subCategoryData);
  }

  async findSubCategory(name: string): Promise<ISubcategory[]> {
    return await SubCategory.find({ name });
  }

  async deleteSubCategory(subCategoryId: string): Promise<ISubcategory | null> {
    if (!isValidObjectId(subCategoryId)) {
      throw new Error(`Invalid category ID: ${subCategoryId}`);
    }
    return await SubCategory.findByIdAndUpdate(subCategoryId, {
      isDeleted: true,
    });
  }
}
