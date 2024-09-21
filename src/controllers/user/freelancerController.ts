import { Request, Response } from "express";
import FreelancerRepository from "../../infrastructure/repositories/FreelancerRepository";
import FreelancerUseCase from "../../use-cases/user/FreelancerUseCase";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import { HttpStatusCode } from "../../utils/httpStatusCode";
import { error } from "console";


const freelancerrepository = new FreelancerRepository();
const userRepository = new UserRepository();
const freelancerusecase = new FreelancerUseCase(
  freelancerrepository,
  userRepository
);

export const createGig = async (req: Request, res: Response) => {
  try {
    const {
      formData: {
        projectName,
        description,
        category,
        subcategory,
        searchTags,
        images,
        deadline,
        price,
      },
      email,
    } = req.body;

    const create = await freelancerusecase.createGig({
      projectName,
      description,
      category,
      subcategory,
      searchTags,
      images,
      deadline,
      price,
      email,
    });
    if (create && create == undefined) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "Something wrong in creating the post" });
    }
    if (create && create == null) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "User not found" });
    }
    return res.status(HttpStatusCode.OK).json({ message: "successfully post added" });
  } catch (err) {
    console.log(err)
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "internal server error" });
  }
};

export const editGig = async (req:Request,res:Response)=>{
  try{
    const {id}=req.params
    const {
      formData: {
        projectName,
        description,
        category,
        subcategory,
        searchTags,
        images,
        deadline,
        price,
      },
    } = req.body;

    const edit = await freelancerusecase.editGig(id,{
      projectName,
      description,
      category,
      subcategory,
      searchTags,
      images,
      deadline,
      price,
    });
    
    if(edit==undefined ||edit==null){
     return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Something wrong in edit freelancer gig'})
    }
    return res.status(HttpStatusCode.OK).json({message:'Project edited successfully'})
  }catch(err){
    console.log(err)
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "internal server error" })
  }
}

export const freelanceWorks = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;
    const posts = await freelancerusecase.listFreelancerWork(email,page,limit);
    if (posts && posts.posts.length > 0) {
      return res.status(HttpStatusCode.OK).json({ data: posts,totalPages:posts.totalPages });
    } else if (posts?.posts === null) {
      return res.status(HttpStatusCode.NO_CONTENT).json({
        success: false,
        message: "User not found or no posts available.",
      });
    } else {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Invalid email or no data provided.",
      });
    }
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export const findSinglegig = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isRequest=req.query.request=='true'?true:false
    const gig = await freelancerusecase.findgig(id,isRequest);
    if (gig == null) {
      return res.status(HttpStatusCode.NO_CONTENT).json({ error: "Cannot found Gig" });
    }
    return res.status(HttpStatusCode.OK).json({ data: gig });
  } catch (err: any) {
    if (err.message.startsWith("Invalid gig ID")) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export const gigs = async (req:Request,res:Response)=>{
  try{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    const searchKey= req.query.serch as string||''
    const sortBy=   req.query.sortBy as string || 'projectName'
    const sortOrder= req.query.sortOrder as string || 'asc'
    const category= req.query.category as string || ''
    const subcategory= req.query.subCategory as string || ''

    const gigs= await freelancerusecase.allGigs(page,limit,searchKey,sortBy,sortOrder,category,subcategory)    
    if(gigs.posts.length>=0){
      return   res.status(HttpStatusCode.OK).json({data:gigs.posts,totalPages:gigs.totalPages})
      }
      return res.status(HttpStatusCode.NO_CONTENT).json({error:'No gigs found'})
  }catch(err){
    console.log(err)
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

export const requestProject = async (req:Request,res:Response)=>{
  try{

    const {email,id,message,price}=req.body
    const data= await freelancerusecase.requestProject(email,id,message,price)
    console.log(data)
    if(data){
      return res.status(HttpStatusCode.OK).json({message:'Success'})
    }
    return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Something went wrong'})

  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "internal server error" })
  }
}


export const changeStatus= async (req:Request,res:Response)=>{
  try{
    const {id,status}=req.params
    const {amount}=req.body
    const data= await freelancerusecase.changeProjectStatus(id,status,amount)
    if(data==null){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Something went wrong'})
    }
    return res.status(HttpStatusCode.OK).json({data})

  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "internal server error" })
  }
}



export const findMyRequests = async(req:Request,res:Response)=>{
  try{
    const {email}=req.params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;
    const requests = await freelancerusecase.myRequests(email,page,limit);
    if (requests && requests.posts.length > 0) {
      return res.status(HttpStatusCode.OK).json({ success: true, data: requests ,totalPages:requests.totalPages});
    } else if (requests === null) {
      return res.status(HttpStatusCode.NO_CONTENT).json({
        success: false,
        message: "User not found or no requests available.",
      });
    } else {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Invalid email or no data provided.",
      });
    }
  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "internal server error" })

  }
}


export const myApprovedProjects = async(req:Request,res:Response)=>{
  try{
    const {email}=req.params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;
    const requests = await freelancerusecase.myApproved(email,page,limit);
    if (requests && requests.posts.length > 0) {
      return res.status(HttpStatusCode.OK).json({ success: true, data: requests ,totalPages:requests.totalPages});
    } else if (requests === null) {
      return res.status(HttpStatusCode.NO_CONTENT).json({
        success: false,
        message: "User not found or no requests available.",
      });
    } else {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Invalid email or no data provided.",
      });
    }
  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "internal server error" })

  }
}

export const setModuleClient = async (req:Request,res:Response)=>{
  try{
    const {id} = req.params
    const {data}=req.body
    const setModule=await freelancerusecase.setProjectModule(id,data)
    if(setModule==null){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Cannot Found the Project'})
     }
     return res.status(HttpStatusCode.OK).json({data:setModule.modules})

  }catch(err){
    console.log(err)
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "internal server error" })
  }
}

export const setModuleFreelancer = async (req:Request,res:Response)=>{
  try{
    const {id} = req.params
    const {data}=req.body
    const setModule=await freelancerusecase.setProjectModuleFreelancer(id,data)
    if(setModule==null){
     return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Cannot Found the Project'})
    }
    return res.status(HttpStatusCode.OK).json({data:setModule.modules})
  }catch(err){
    console.log(err)
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "internal server error" })
  }
}

export const deleteGig = async (req:Request,res:Response)=>{
  try{
    const {projectId}=req.params
    const deleteProject=await freelancerusecase.deleteProject(projectId)
    if(deleteProject==null){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'There is some issue in delete project'})
    }
    return res.status(HttpStatusCode.OK).json({message:'Project deleted successfully',posts:deleteProject})

  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "internal server error" })
  
  }
}

