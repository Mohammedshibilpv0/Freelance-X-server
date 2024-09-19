import { userPosts } from "../../controllers/user/ClientContoller";
import { IFreelancerGig } from "../../doamin/entities/IFreelancerGig";
import { IUserPost, requestInterface } from "../../doamin/entities/UserPost";
import { IClientRepository } from "../../interface/IClientRepository";
import FreelancerGig from "../database/models/FreelancerGigModel";
import PaymentTransaction from "../database/models/TransactionModel";
import UserPost from "../database/models/UserPostModal";
import mongoose from "mongoose";

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export default class ClientRepository implements IClientRepository {
  async createPost(data: IUserPost): Promise<IUserPost> {
    if (data.projectName) {
      data.projectName = data.projectName.charAt(0).toUpperCase() + data.projectName.slice(1);
    }
  
    data.requests = [];
    return UserPost.create(data);
  }

  async findPost(id: string,isRequest:boolean): Promise<IUserPost |IFreelancerGig |null> {
    if (!isValidObjectId(id)) {
      throw new Error(`Invalid post ID: ${id}`);
    }
   if(isRequest){
    return await FreelancerGig.findById(id).populate('category').populate('subcategory') .populate({
      path: 'requests.userId',
      select:'email firstName secondName',
      model: 'User' 
    });
   }else{
    return await UserPost.findById(id).populate('category').populate('subcategory') .populate({
      path: 'requests.userId',
      select:'email firstName secondName',
      model: 'User' 
    });
   }
      
  }

  async listUserPosts(id: string,page:number,limit:number): Promise<{ posts: IUserPost[], totalPages: number }> {

    const skip = (page - 1) * limit;
    const [posts, totalPosts] = await Promise.all([
      UserPost.find({ userId: id }).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      UserPost.countDocuments().exec()
    ]);
    const totalPages = Math.ceil(totalPosts / limit);

    return {posts,totalPages}
  }



async allPost(
  page: number,
  limit: number,
  key: string,
  sortBy: string,
  sortOrder: string,
  category: string,
  subcategory: string
): Promise<{ posts: IUserPost[], totalPages: number }> {
  console.log(sortOrder)
  const skip = (page - 1) * limit;
  const sortField = sortBy === 'price' ? 'startBudget' : 'projectName';

  const projectNameFilter = key ? { projectName: { $regex: key, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const subcategoryFilter = subcategory ? { subcategory } : {};

  const sortObject: any = {};
  if (sortBy) {
      sortObject[sortField] = sortOrder == 'desc' ? -1 : 1;
  }

  const filter = {
      status: { $ne: "Approved" },
      ...projectNameFilter,
      ...categoryFilter,
      ...subcategoryFilter,
  };

  const [posts, totalPosts] = await Promise.all([
      UserPost.find(filter)
          .sort(sortObject)
          .skip(skip)
          .limit(limit)
          .exec(),
      UserPost.countDocuments(filter).exec()
  ]);

  const totalPages = Math.ceil(totalPosts / limit);

  return { posts, totalPages };
}


async requestProject(data: requestInterface, id: string): Promise<IUserPost | null> {
    const updatedUserPost = await UserPost.findByIdAndUpdate(
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


  async changeStatus(id: string,status:string,amount:number): Promise<IUserPost | null> {
    const userPost = await UserPost.findOneAndUpdate(
        { 'requests._id': id }, 
        { $set: { 'requests.$.status': status} },
        { new: true } 
    );

    if(status=='Approved' && userPost){
      userPost.status=status
      userPost.paymentAmount=amount
      await userPost.save()
    }

    return userPost;
}

async  listMyRequests(id: string, page: number, limit: number): Promise<{ posts: IFreelancerGig[]; totalPages: number; }> {
 
  if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be greater than 0.');
  }


  const skip = (page - 1) * limit;


  const totalPostsCount = await FreelancerGig.countDocuments({
      'requests.userId': new  mongoose.Types.ObjectId(id),
      'status':'Pending'
  });


  const totalPages = Math.ceil(totalPostsCount / limit);


  const posts = await FreelancerGig.find({
      'requests.userId':new  mongoose.Types.ObjectId(id),
      'status':'Pending'
  })
  .skip(skip)
  .limit(limit)
  .populate('category')
  .populate('subcategory')
  .exec();
   console.log(posts)
  return {
      posts,
      totalPages,
  };
}
async  listApproved(id: string, page: number, limit: number): Promise<{ posts: IFreelancerGig[]; totalPages: number; }> {
 
  if (page < 1 || limit < 1) {
      throw new Error('Page and limit must be greater than 0.');
  }


  const skip = (page - 1) * limit;


  const totalPostsCount = await FreelancerGig.countDocuments({
      'requests.userId': new  mongoose.Types.ObjectId(id),
      'status':'Approved'
  });


  const totalPages = Math.ceil(totalPostsCount / limit);


  const posts = await FreelancerGig.find({
      'requests.userId':new  mongoose.Types.ObjectId(id),
      'status':'Approved'
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

async  successPayment(token: string, projectId: string,amount:string,isPost:string): Promise<any> {
  try {
    let project
    if(isPost=='false'){
      project = await FreelancerGig.findById(projectId).exec();
    }else{
      project = await UserPost.findById(projectId).exec();
    }
    if (!project) {
      throw new Error('Project not found');
    }

    const senderId = project.userId;

    if (project.requests && project.requests.length > 0) {
      const approvedReceiver = project.requests.find((req) => req.status === "Approved");

      if (!approvedReceiver) {
        throw new Error('No approved receiver found');
      }

      const transaction = new PaymentTransaction({
        transactionId: token,
        receiverId: approvedReceiver.userId,
        senderId: senderId,
        amount: amount, 
        currency: 'USD',
        status: 'completed',
      });

      await transaction.save();

      if (project.modules) {
        const moduleToUpdate = project.modules.find((mod) => !mod.isPaid);
        if (moduleToUpdate) {
          moduleToUpdate.isPaid = true;
          await project.save();
        }
      }

      return { message: 'Payment successful', transaction };
    } else {
      throw new Error('No requests found in the project');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error('Error processing payment');
  }
}


 async deleteProject(projectId: string): Promise<IUserPost | null> {
   try{
    return await UserPost.findByIdAndUpdate(projectId,{isDelete:true})
   }catch(err){
    console.error('Error in delete project:', err);
    throw new Error('Error in delete project');
   }
 }

}
