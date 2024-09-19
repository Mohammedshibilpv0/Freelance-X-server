import { IFreelancerGig, requestInterface } from "../../doamin/entities/IFreelancerGig";
import mongoose from "mongoose";
import { IFreelancerRepository } from "../../interface/IFreelancerRepository";
import FreelancerGig from "../database/models/FreelancerGigModel";
import { IUserPost } from "../../doamin/entities/UserPost";
import UserPost from "../database/models/UserPostModal";
import Category from "../database/models/CategoryModel";
import SubCategory from "../database/models/Subcategory";
import { ICategory } from "../../doamin/entities/Category";
import { ISubcategory } from "../../doamin/entities/SubCategory";

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export default class FreelancerRepository implements IFreelancerRepository {
  async createGig(data: IFreelancerGig): Promise<IFreelancerGig | null> {
    if (data.projectName) {
      data.projectName = data.projectName.charAt(0).toUpperCase() + data.projectName.slice(1);
    }
    return await FreelancerGig.create(data);
  }

  async findCategoryName (id:string):Promise<ICategory|null>{
    if (!isValidObjectId(id)) {
      return null; 
    }
    return await  Category.findById(id);
  }
  async findSubCategoryName(id:string):Promise<ISubcategory|null>{
    if (!isValidObjectId(id)) {
      return null;
    }
    return await SubCategory.findById(id)
  }

  async listFreelancerWork(id: string,page:number,limit:number): Promise< { posts: IFreelancerGig[], totalPages: number }> {

    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      FreelancerGig.find({userId: id}).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      FreelancerGig.countDocuments().exec()
    ]);
    const totalPages = Math.ceil(totalPosts / limit);
    return {posts,totalPages}
  }

  async findGig(id: string,isRequest:boolean): Promise<IFreelancerGig|IUserPost| null> {
    if (!isValidObjectId(id)) {
      throw new Error(`Invalid Gig ID: ${id}`);
    }
   if(isRequest){
    return await UserPost.findById(id).populate('category').populate('subcategory').populate({
      path: 'requests.userId',
      select:'email firstName secondName',
      model: 'User' 
    })
   }
   return await FreelancerGig.findById(id).populate('category').populate('subcategory').populate({
    path: 'requests.userId',
    select:'email firstName secondName',
    model: 'User' 
  })
  }


async allGigs(
  page: number,
  limit: number,
  key: string,
  sortBy: string,
  sortOrder: string,
  category: string,
  subcategory: string
): Promise<{ posts: IFreelancerGig[], totalPages: number }> {
  const skip = (page - 1) * limit;
  const sortObject: any = {};
  const order = sortOrder === 'desc' ? -1 : 1;
  if (sortBy) {
    sortObject[sortBy] = order
  }

  const searchFilter = key ? { title: { $regex: key, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const subcategoryFilter = subcategory ? { subcategory } : {};
  const filter = {
    status: { $ne: "Approved" },
    ...searchFilter,
    ...categoryFilter,
    ...subcategoryFilter,
  };


  const [posts, totalPosts] = await Promise.all([
    FreelancerGig.find(filter)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .exec(),
    FreelancerGig.countDocuments(filter).exec()
  ]);

  const totalPages = Math.ceil(totalPosts / limit);
  return { posts, totalPages };
}


 async requestProject(data: requestInterface, id: string): Promise<IFreelancerGig | null> {
  const updatedUserPost = await FreelancerGig.findByIdAndUpdate(
    data.id,
    {
      $push: {
        requests: {
          message: data.message,
          userId: id,
          price:data.price,
          status:data.status
        }
      }
    },
    { new: true }
  );

  return updatedUserPost;
}

async changeStatus(id: string, status: string,amount:number): Promise<IFreelancerGig | null> {
  const userPost = await FreelancerGig.findOneAndUpdate(
    { 'requests._id': id }, 
    { $set: { 'requests.$.status': status } }, 
    { new: true } 
  );

  if (status === 'Approved' && userPost && userPost.requests) {
    const matchedRequest = userPost.requests.find((request: any) => request._id.toString() === id);

    if (matchedRequest) {
      if (!userPost.paymentAmount) {
        userPost.paymentAmount = 0;
      }
      userPost.paymentAmount += matchedRequest.price;

      userPost.status = status;
    }

    await userPost.save();
  }

  return userPost;
}


async  listMyRequests(id: string, page: number, limit: number): Promise<{ posts: IUserPost[]; totalPages: number; }> {
 
  if (page < 1 || limit < 1) {
    throw new Error('Page and limit must be greater than 0.');
}

const skip = (page - 1) * limit;

const totalPostsCount = await UserPost.countDocuments({
    'requests.userId': new mongoose.Types.ObjectId(id),
    'status': 'Pending'
});

const totalPages = Math.ceil(totalPostsCount / limit);

const posts = await UserPost.find({
    'requests.userId': new mongoose.Types.ObjectId(id),
    'status': 'Pending'
})
.skip(skip)
.limit(limit)
.populate('category')
.populate('subcategory')
.exec();

return {
    posts,
    totalPages,
};
}

async  listApproved(id: string, page: number, limit: number): Promise<{ posts: IUserPost[]; totalPages: number; }> {
 
  if (page < 1 || limit < 1) {
    throw new Error('Page and limit must be greater than 0.');
}

const skip = (page - 1) * limit;

const totalPostsCount = await UserPost.countDocuments({
    'requests.userId': new mongoose.Types.ObjectId(id),
    'status': 'Approved'
});

const totalPages = Math.ceil(totalPostsCount / limit);

const posts = await UserPost.find({
    'requests.userId': new mongoose.Types.ObjectId(id),
    'status': 'Approved'
})
.skip(skip)
.limit(limit)
.populate('category')
.populate('subcategory')
.exec();
return {
    posts,
    totalPages,
};
}

async setModuleClientPost(id: string, data: object): Promise<IUserPost | null> {
  return await UserPost.findByIdAndUpdate(id,{modules:data},{ new: true })
}

async setModuleFreelancerPost(id: string, data: object): Promise<IFreelancerGig | null> {
  return await FreelancerGig.findByIdAndUpdate(id,{modules:data},{ new: true })
}

async deleteProject(projectId: string): Promise<IFreelancerGig | null> {
  try{
   return await FreelancerGig.findByIdAndUpdate(projectId,{isDelete:true})
  }catch(err){
   console.error('Error in delete project:', err);
   throw new Error('Error in delete project');
  }
}

}
