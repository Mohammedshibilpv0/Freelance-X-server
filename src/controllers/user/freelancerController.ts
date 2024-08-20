import { Request, Response } from "express";
import FreelancerRepository from "../../infrastructure/repositories/FreelancerRepository";
import FreelancerUseCase from "../../use-cases/user/FreelancerUseCase";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import { error } from "console";

const freelancerrepository = new FreelancerRepository();
const userRepository = new UserRepository();
const freelancerusecae = new FreelancerUseCase(
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

    const create = await freelancerusecae.createGig({
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
        .status(400)
        .json({ error: "Something wrong in creating the post" });
    }
    if (create && create == null) {
      return res.status(400).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "successfully post added" });
  } catch (err) {
    return res.status(500).json({ error: "internal server error" });
  }
};

export const freelanceWorks = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 4;
    const works = await freelancerusecae.listFreelancerWork(email,page,limit);

    if (works && works.posts.length > 0) {
      return res.status(200).json({ data: works.posts,totalPages:works.totalPages });
    } else if (works?.posts === null) {
      return res.status(404).json({
        success: false,
        message: "User not found or no works available.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid email or no data provided.",
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const findSinglegig = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const gig = await freelancerusecae.findgig(id);
    if (gig == null) {
      return res.status(400).json({ error: "Cannot found Gig" });
    }
    return res.status(200).json({ data: gig });
  } catch (err: any) {
    if (err.message.startsWith("Invalid gig ID")) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const gigs = async (req:Request,res:Response)=>{
  try{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;

    const gigs= await freelancerusecae.allGigs(page,limit)    
    if(gigs.posts.length>=0){
      return   res.status(200).json({data:gigs.posts,totalPages:gigs.totalPages})
      }
      return res.status(400).json({error:'No gigs found'})
  }catch(err){
    return res.status(500).json({ error: "Internal server error" });
  
  }
}
