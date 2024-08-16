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
        .send({ url: profile.trim(), message: "User profile updated" });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};
