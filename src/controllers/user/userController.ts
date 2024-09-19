import  { Request, Response } from 'express';
import userUseCase from '../../use-cases/user/userUseCase';
import UserRepository from '../../infrastructure/repositories/UserRepository';
import { bucket } from '../../utils/firebase';
import { mapUserProfile } from '../../interface/mappers/userMapper';
import FirebaseImageUploader from '../../utils/firebaseImageUploader';
import { HttpStatusCode } from '../../utils/httpStatusCode';

const userRepository = new UserRepository();
const useruseCase=new userUseCase(userRepository)
const imageUploader=new FirebaseImageUploader(bucket)

export const editUser= async(req:Request,res:Response)=>{
    try{
        const {Data}=req.body            
       let editProfile= await useruseCase.editUserProfile(Data)  
       if(editProfile){
        const userData=mapUserProfile(editProfile)
        return res.status(HttpStatusCode.OK).json({message:" Successfully edited the user profile",userData})
       }
       return res.status(HttpStatusCode.BAD_REQUEST).json({error:"Something wrong in edit profile please try again"})
      
    }catch(err){
        return res.status(500).json({error:"internal server error"})

    }
}

export const editUserProfileImage = async (req: Request, res: Response) => {
    try {
     
      const { Data } = req.body;
      const parsedUserData = JSON.parse(Data);
      const email = parsedUserData.email
      if (!req.file) {
        return res.status(HttpStatusCode.BAD_REQUEST).send('No file uploaded.');
      }
      const uploadImage= await imageUploader.uploadImage(req,email,parsedUserData)
      if(uploadImage){
        res.status(HttpStatusCode.OK).json({url:uploadImage.url,message:'Image changed successfully'})
      }
  
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "internal server error" });
    }
  };

  export const switchRole =async(req:Request,res:Response)=>{
    try{
      const {action,email}=req.body
      const changeRole=await useruseCase.changeUserRole(email,action)
      if(changeRole==null){
        return res.status(HttpStatusCode.BAD_REQUEST).json({error:'User not found'})
      }
      return res.status(HttpStatusCode.OK).json({message:'Role change success'})
      
    }catch(err){
      return res.status(500).json({ error: "internal server error" });
    }
  }


export const subcategories = async (req:Request,res:Response)=>{
  try{
    const {id}=req.params
    const subcategories=await useruseCase.getSubcategories(id)
    if(subcategories==null){      
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'No subcategory found'})
    }
    return res.status(HttpStatusCode.OK).json({message:'Retrive subcategories',subcategories})

  }catch(err:any){
    if (err.message.startsWith("Invalid category ID")) {      
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(500).json({ error: "internal server error" });
  }
}

export const findUser =async (req:Request,res:Response)=>{
  try{
    const {id}=req.params

    const user= await useruseCase.findUserById(id)
    if(user==null || undefined){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'User Not found'})
    }
    return res.status(HttpStatusCode.OK).json({data:user})

  }catch(err:any){
    if (err.message.startsWith("Invalid User ID")) {      
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(500).json({ error: "internal server error" });
  }
}

export const categories = async (req:Request,res:Response)=>{
  try{
    const categories= await useruseCase.categories()
    if(categories==null){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Categories Not found'})
    }
    return res.status(HttpStatusCode.OK).json({ categories: categories})

  }catch(err){
    return res.status(500).json({ error: "internal server error" });
  }
}

export const friendList = async(req:Request,res:Response)=>{
  try{
    const {id}=req.params
    const list = await useruseCase.findLists(id)
    if(list==null){
    return res.status(HttpStatusCode.NO_CONTENT).json({message:'Your friend list is empty'})
    }
    return res.status(HttpStatusCode.OK).json({list})

  }catch(err){
    return res.status(500).json({ error: "internal server error" }); 
  }
}

export const userMessages = async (req:Request,res:Response)=>{
  try{
    const {id}=req.params
    const messages= await useruseCase.getMessages(id)
    if(messages==null){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Something went wrong'})
    }
   return res.status(HttpStatusCode.OK).json({messages})
  }catch(err:any){
    if (err.message.startsWith("Invalid  ID")) {      
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(500).json({ error: "internal server error" }); 
  }
}

export const getNotifications = async (req:Request,res:Response)=>{
  try{
    const {id}=req.params

    const myNotifications= await useruseCase.getNotifications(id)
    if(myNotifications==null){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Something went wrong'})
    }

    return res.status(HttpStatusCode.OK).json({data:myNotifications})
  }catch(err:any){
    if (err.message.startsWith("Invalid ID")) {      
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(500).json({ error: "internal server error" }); 
  }
  
}


export const getTransaction = async(req:Request,res:Response)=>{
  try{
    const {id}=req.params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4; 
    const transactionHistory= await useruseCase.transactionHistory(id,page,limit)
    if(transactionHistory==null){
      return res.status(HttpStatusCode.BAD_REQUEST).json({message:'Something went wrong cannot find the transaction'})
    }
    return res.status(HttpStatusCode.OK).json({transactionHistory:transactionHistory.transaction,totalPages:transactionHistory.totalPages})
  }catch(err:any){
    if (err.message.startsWith("Invalid ID")) {      
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(500).json({ error: "internal server error" }); 
  }
}



export const handleReport = async(req:Request,res:Response)=>{
  try{

    const {data}=req.body
    const reportUser= await useruseCase.handleReport(data)
    if(reportUser==null){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Error in report please try again later'})
    }
    return res.status(HttpStatusCode.OK).json({message:'success'})

  }catch(err:any){
    return res.status(500).json({ error: "internal server error" }); 
    }
}