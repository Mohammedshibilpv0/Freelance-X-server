import UserModel from "../database/models/UserModel";
import mongoose from "mongoose";
import { IUserSummary } from "../../doamin/entities/User";
import { IAdminRepository } from "../../interface/IAdminRepository";
import { ICategory, IEditCategory } from "../../doamin/entities/Category";
import Category from "../database/models/CategoryModel";
import SubCategory from "../database/models/Subcategory";
import { ISubcategory } from "../../doamin/entities/SubCategory";
import { IUserPost } from "../../doamin/entities/UserPost";
import UserPost from "../database/models/UserPostModal";
import { IFreelancerGig } from "../../doamin/entities/IFreelancerGig";
import FreelancerGig from "../database/models/FreelancerGigModel";
import { ReportRequestBody } from "../../doamin/entities/Report";
import Report, { IReport } from "../database/models/ReportModel";

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

  async addCategory(name: string, description: string,image:string): Promise<ICategory> {
    return await Category.create({ name, description,image });
  }

  async findAlreadyCategory(name:string):Promise<ICategory|null>{
    return await Category.findOne({ name });
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
    description: string,
    image?:string|undefined
  ): Promise<ICategory | null> {
    const editCategoryObj:IEditCategory={
      name,
      description
    }
    if(image){
      editCategoryObj.image=image
    }
    if (!isValidObjectId(categoryId)) {
      throw new Error(`Invalid category ID: ${categoryId}`);
    }
    return await Category.findByIdAndUpdate(categoryId, editCategoryObj);
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

  async userPosts(page: number, limit: number): Promise<{ userPosts: IUserPost[]; totalPages: number; }> {
    const skip = (page - 1) * limit;

    const [userPosts, totalPosts] = await Promise.all([
      UserPost.find()
        .sort({ createdAt: -1 })  
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'category', 
          select: 'name'     
        })
        .populate({
          path: 'subcategory', 
          select: 'name'       
        })
        .lean()
        .exec() as Promise<IUserPost[]>, 

      UserPost.countDocuments().exec() 
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    return { userPosts, totalPages };
}


   async handleBlockUserPost(proId: string, status: boolean): Promise<IUserPost | null> {
     return await UserPost.findByIdAndUpdate(proId,{isBlock:status}, { new: true } )
   }

   async handleBlockGig(proId: string, status: boolean): Promise<IFreelancerGig | null> {
    return await FreelancerGig.findByIdAndUpdate(proId,{isBlock:status}, { new: true } )
   }

   async freelancerGig(page: number, limit: number): Promise<{ userPosts: IFreelancerGig[]; totalPages: number; }> {
    const skip = (page - 1) * limit;

    const [userPosts, totalPosts] = await Promise.all([
        FreelancerGig.find()
        .sort({ createdAt: -1 })  
        .skip(skip)
        .limit(limit)
        .lean()
        .exec() as Promise<IFreelancerGig[]>, 

      UserPost.countDocuments().exec() 
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    return { userPosts, totalPages };
   }


   async getReports(page:number,limit:number): Promise<{reports:IReport[],totalPages:number}|undefined> {
     try{
      const skip = (page - 1) * limit;
      const [reports, totalPosts] = await Promise.all([
        Report.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('reportedUserId', 'firstName secondName email isBlock') 
          .populate('reporterUserId', 'firstName secondName email isBlock')
          .lean() 
          .exec() as Promise<IReport[]>, 
        UserModel.countDocuments().exec(),
      ]);
      const totalPages = Math.ceil(totalPosts / limit);
    
      return { reports, totalPages };
     }catch(err){
     }
   }

  
  async dashboard(): Promise<any> {
    try {
      const [userCount, postCount, gigCount] = await Promise.all([
        UserModel.countDocuments(),
        UserPost.countDocuments({ isDelete: false, isBlock: false }),
        FreelancerGig.countDocuments({ isDelete: false, isBlock: false })
      ]);
  
      // Fetch monthly data for Posts
      const postMonthlyData = await UserPost.aggregate([
        {
          $match: { isDelete: false, isBlock: false }
        },
        {
          $group: {
            _id: { $month: '$createAt' },
            Posts: { $sum: 1 },
            Profit: {
              $sum: {
                $reduce: {
                  input: '$modules',
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      { $cond: [{ $eq: ['$$this.isPaid', true] }, { $multiply: ['$$this.amount', 0.05] }, 0] }
                    ]
                  }
                }
              }
            }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
  
      // Fetch monthly data for Gigs
      const gigMonthlyData = await FreelancerGig.aggregate([
        {
          $match: { isDelete: false, isBlock: false }
        },
        {
          $group: {
            _id: { $month: '$createAt' },
            Gigs: { $sum: 1 },
            Profit: {
              $sum: {
                $reduce: {
                  input: '$modules',
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      { $cond: [{ $eq: ['$$this.isPaid', true] }, { $multiply: ['$$this.amount', 0.05] }, 0] }
                    ]
                  }
                }
              }
            }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
  
      // Fetch monthly data for Users (new registrations)
      const userMonthlyData = await UserModel.aggregate([
        {
          $group: {
            _id: { $month: '$createAt' },
            Users: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
  
      const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  
      // Merge Posts, Gigs, and Users data into one monthly dataset
      const mergedMonthlyData = allMonths.map(month => {
        const postMonth = postMonthlyData.find(p => p._id === month) || { Posts: 0, Profit: 0 };
        const gigMonth = gigMonthlyData.find(g => g._id === month) || { Gigs: 0, Profit: 0 };
        const userMonth = userMonthlyData.find(u => u._id === month) || { Users: 0 };
  
        return {
          name: new Date(0, month - 1).toLocaleString('default', { month: 'short' }),
          Posts: postMonth.Posts,
          Gigs: gigMonth.Gigs,
          Users: userMonth.Users,
          Profit: postMonth.Profit + gigMonth.Profit
        };
      });
  
      const totalProfit = mergedMonthlyData.reduce((sum, month) => sum + month.Profit, 0);
  
      const metricsData = [
        { title: 'Total Users', value: userCount.toLocaleString(), change: 10, icon: 'users', color: 'text-blue-600' },
        { title: 'Total Posts', value: postCount.toLocaleString(), change: -5, icon: 'message-square', color: 'text-green-600' },
        { title: 'Active Gigs', value: gigCount.toLocaleString(), change: 25, icon: 'briefcase', color: 'text-yellow-600' },
        { title: 'Total Profit', value: `$${totalProfit.toFixed(2)}`, change: 15, icon: 'dollar-sign', color: 'text-red-600' }
      ];
  
      const overviewData = [
        { name: 'Users', value: userCount, color: '#3b82f6' },
        { name: 'Posts', value: postCount, color: '#10b981' },
        { name: 'Gigs', value: gigCount, color: '#f59e0b' },
        { name: 'Profit', value: totalProfit, color: '#ef4444' }
      ];
  
      return { overviewData, monthlyData: mergedMonthlyData, metricsData };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }
  
  
  
  
  
   
}
