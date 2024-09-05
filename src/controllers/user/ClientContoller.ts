import { Request, Response } from "express";
import ClientRepository from "../../infrastructure/repositories/ClientRepository";
import ClientUseCase from "../../use-cases/user/ClientUseCase";
import { bucket } from "../../utils/firebase";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import { STRIPE_SECRET } from "../../config/env";
const stripe = require('stripe')(STRIPE_SECRET)

const clientrepository = new ClientRepository();
const userRepository = new UserRepository();
const clientusecase = new ClientUseCase(clientrepository, userRepository);

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
    const { email } = req.body;

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
      email,
    });
    if (addPost && addPost == undefined) {
      return res
        .status(400)
        .json({ error: "Something wrong in creating the post" });
    }
    if (addPost && addPost == null) {
      return res.status(400).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "successfully post added" });
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
      return res
        .status(200)
        .send({
          data: { url: profile.trim() },
          message: "User profile updated",
        });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
};

export const getClientPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isRequest=req.query.request=='true'?true:false
    const post = await clientusecase.findPost(id,isRequest);
    if (post == null) {
      return res.status(400).json({ error: "Cannot found post" });
    }
    return res.status(200).json({ data: post });
  } catch (err: any) {
    if (err.message.startsWith("Invalid post ID")) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ error: "internal server error" });
  }
};

export const userPosts = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;
    const posts = await clientusecase.listposts(email,page,limit);

    if (posts && posts.posts.length > 0) {
      return res.status(200).json({ success: true, data: posts ,totalPages:posts.totalPages});
    } else if (posts === null) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or no data provided."});
    } else {
      return res.status(400).json({
        success: false,
        message: "User not found or no posts available.",
      
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
};

export const listPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;

    const allPosts= await clientusecase.allPosts(page,limit)
    if(allPosts.posts.length>=0){
    return   res.status(200).json({data:allPosts.posts,totalPages:allPosts.totalPages})
    }
    return res.status(400).json({error:'No post found'})
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
};



export const requestProject = async (req:Request,res:Response)=>{
  try{

    const {email,id,message,price}=req.body
    const data= await clientusecase.requestProject(email,id,message,price)
    if(data){
      return res.status(200).json({message:'Success'})
    }
    return res.status(400).json({error:'Something went wrong'})

  }catch(err){
    return res.status(500).json({ error: "internal server error" })
  }
}


export const changeStatus= async (req:Request,res:Response)=>{
  try{
    const {id,status}=req.params
    const data= await clientusecase.changeProjectStatus(id,status)
    if(data==null){
      return res.status(400).json({error:'Something went wrong'})
    }
    return res.status(200).json({data})

  }catch(err){
    console.log(err)
    return res.status(500).json({ error: "internal server error" })
  }
}

export const findMyRequests = async(req:Request,res:Response)=>{
  try{
    const {email}=req.params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;
    const requests = await clientusecase.myRequests(email,page,limit);
    if (requests && requests.posts.length > 0) {
      return res.status(200).json({ success: true, data: requests ,totalPages:requests.totalPages});
    } else if (requests === null) {
      return res.status(404).json({
        success: false,
        message: "User not found or no requests available.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid email or no data provided.",
      });
    }
  }catch(err){
    console.log(err)
    return res.status(500).json({ error: "internal server error" })
  }
}

export const myApprovedProjects = async(req:Request,res:Response)=>{
  try{
    const {email}=req.params
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;
    const requests = await clientusecase.myApproved(email,page,limit);
    if (requests && requests.posts.length > 0) {
      return res.status(200).json({ success: true, data: requests ,totalPages:requests.totalPages});
    } else if (requests === null) {
      return res.status(404).json({
        success: false,
        message: "User not found or no requests available.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid email or no data provided.",
      });
    }
  }catch(err){
    return res.status(500).json({ error: "internal server error" })
  }
}

export const createCheckout = async (req: Request, res: Response) => {
  try {
    const { data,projectData } = req.body;
    const randomNumber = Math.floor(Math.random() * 100000);
    const token = `${projectData._id}-${randomNumber}`;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: projectData.projectName,
            },
            unit_amount: Math.round(data.amount * 100), 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/success/${token}/${projectData._id}/${Math.round(data.amount)}/${projectData.startBudget?'true':'false'}`,
      cancel_url: `http://localhost:5173/fail/${token}/${projectData._id}/${Math.round(data.amount)}/${projectData.startBudget?'true':'false'}`,
    });
    res.json({ id: session.id });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const successPayment= async (req:Request,res:Response)=>{
  try{
    const {token}=req.params
    let {id,amount,isPost}=req.body
    const handlePaymentStatus= await clientusecase.successPayment(token,id,amount,isPost)

  }catch(err){
    return res.status(500).json({ error: 'Internal server error' });
  }
}