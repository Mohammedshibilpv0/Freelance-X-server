import { Request, Response } from "express";
import ClientRepository from "../../infrastructure/repositories/ClientRepository";
import ClientUseCase from "../../use-cases/user/ClientUseCase";
import { bucket } from "../../utils/firebase";
import UserRepository from "../../infrastructure/repositories/UserRepository";

const clientrepository = new ClientRepository();
const userRepository= new UserRepository()
const clientusecase = new ClientUseCase(clientrepository,userRepository);

export const createPost = async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      description,
      skills,
      startBudget,
      endBudget,
      deadline,
      keyPoints,
      images,
      searchKey,
      category,
      subcategory,
  
    } = req.body.formData;
    const {email}=req.body
    

    const addPost = await clientusecase.userPost({
      projectName,
      description,
      skills,
      startBudget,
      endBudget,
      deadline,
      keyPoints,
      images,
      category,
      searchKey,
      subcategory,
      email
    });
    if(addPost && addPost==undefined){
     return  res.status(400).json({error:'Something wrong in creating the post'})
    }
    if(addPost && addPost== null ){
      return  res.status(400).json({error:'User not found'})
    }
    return res.status(200).json({message:'successfully post added'})
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
};


export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const timestamp = Date.now();
    const originalName = req.file.originalname;
    const newFileName = `${timestamp}${originalName}`;

    const blob = bucket.file(newFileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      return res.status(500).send(err.message);
    });

    blobStream.on("finish", async () => {
      const encodedFileName = encodeURIComponent(newFileName);
      const profile = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedFileName}?alt=media`;
      console.log(profile);

      return res
        .status(200)
        .send({data:{url: profile.trim()}, message: "User profile updated" });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
};


export const getClientPost =async (req:Request,res:Response)=>{
  try{
    const {id}=req.params

    const post = await clientusecase.findPost(id);
    if (post == null) {
      return res.status(400).json({ error: "Cannot found post" });
    }
    return res.status(200).json({ data: post });

  }catch(err:any){
    if (err.message.startsWith("Invalid post ID")) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ error: "internal server error" });
  }
}

export const userPosts = async (req:Request,res:Response)=>{
  try{
    
    const {email}=req.params
    const posts = await clientusecase.listposts(email);

    if (posts && posts.length > 0) {
      return res.status(200).json({ success: true, data: posts });
    } else if (posts === null) {
      return res.status(404).json({
        success: false,
        message: "User not found or no posts available.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid email or no data provided.",
      });
    }

  }catch(err){
    return res.status(500).json({ error: "internal server error" });
  }
}