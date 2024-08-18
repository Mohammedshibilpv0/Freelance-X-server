import  { Request, Response } from 'express';
import userUseCase from '../../use-cases/user/userUseCase';
import UserRepository from '../../infrastructure/repositories/UserRepository';
import { bucket } from '../../utils/firebase';
import { error } from 'console';


const userRepository = new UserRepository();
const useruseCase=new userUseCase(userRepository)

export const editUser= async(req:Request,res:Response)=>{
    try{
        const {Data}=req.body    
         
       let editProfile= await useruseCase.editUserProfile(Data)  
        const userData={
            email:editProfile?.email,
            phone:editProfile?.phone,
            firstName:editProfile?.firstName,
            secondName:editProfile?.secondName,
            description:editProfile?.description,
            skills:editProfile?.skills,
            country:editProfile?.country,
            profile:editProfile?.profile
        }

        
       
       if(editProfile){
        return res.status(200).json({message:" Successfully edited the user profile",userData})
       }
       return res.status(400).json({error:"Something wrong in edit profile please try again"})
      
    }catch(err){
        return res.status(500).json({error:"internal server error"})

    }
}

export const editUserProfileImage = async (req: Request, res: Response) => {
    try {
     
      const { Data } = req.body;
      console.log(req.file);
      
      const parsedData = JSON.parse(Data);
      const email = parsedData.email
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      
      const timestamp = Date.now();
      const originalName = req.file.originalname;
      const newFileName = `${timestamp}${originalName}`;
    
      
  
      const blob = bucket.file(newFileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype
        }
      });
  
      blobStream.on('error', (err) => {
       return res.status(500).send(err.message);
      });
  
      blobStream.on('finish',async () => {
        
        const encodedFileName = encodeURIComponent(newFileName);
        const profile = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedFileName}?alt=media`;
        parsedData.profile=profile
       await userRepository.updateUser(parsedData,email)
       return res.status(200).send({ url: profile.trim(),message:"User profile updated" });
      });
  
      blobStream.end(req.file.buffer);
  
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
        return res.status(400).json({error:'User not found'})
      }
      return res.status(200).json({message:'Role change success'})
      
    }catch(err){
      return res.status(500).json({ error: "internal server error" });
    }
  }


export const subcategories = async (req:Request,res:Response)=>{
  try{
    const {id}=req.params
    const subcategories=await useruseCase.getSubcategories(id)
    if(subcategories==null){      
      return res.status(400).json({error:'No subcategory found'})
    }
    return res.status(200).json({message:'Retrive subcategories',subcategories})

  }catch(err:any){
    if (err.message.startsWith("Invalid category ID")) {      
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ error: "internal server error" });
  }
}