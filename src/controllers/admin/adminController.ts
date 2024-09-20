import { Request, Response } from "express";
import UserRepository from "../../infrastructure/repositories/UserRepository";
import CheckuserExists from "../../use-cases/auth/CheckuserExists";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../interface/security/jwt";
import findallusers from "../../use-cases/admin/handleIUser";
import AdminRepository from "../../infrastructure/repositories/AdminRepository";
import CategoryUseCase from "../../use-cases/admin/CategoryUseCae";
import { HttpStatusCode } from "../../utils/httpStatusCode";

const userRepository = new UserRepository();
const checkuser = new CheckuserExists(userRepository);
const adminrepository = new AdminRepository();
const handleUser = new findallusers(adminrepository);
const handleCategory = new CategoryUseCase(adminrepository);

let COOKIESECURE='production'
const cookieOptions = {
  httpOnly: true,
  secure: COOKIESECURE === 'production', 
  sameSite:  'none' as const , 
};


export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    let checkDetails = await checkuser.execute(email);
    if (!checkDetails) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Admin not Found" });
    }
    if (checkDetails && checkDetails.isAdmin == false) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Admin not Found" });
    }
    let checkPassword = await bcrypt.compare(password, checkDetails.password);
    if (!checkPassword) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Password is not matched" });
    }

    const accessToken = generateAccessToken(checkDetails);
    const refreshToken = generateRefreshToken(checkDetails);
    
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });


    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
    return res
      .status(HttpStatusCode.OK)
      .json({ message: "Admin Loged", accessToken, refreshToken });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export const listallusers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 7;
    const users = await handleUser.findusers(page,limit);
    if (users && users.users.length > 0) {
      return res.status(HttpStatusCode.OK).json({ success: true, data: users ,totalPages:users.totalPages});
    } else{
      return res.status(404).json({
        success: false,
        message: "User not found or no users available.",
      });
    }
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { action, email } = req.body;
    const updateUser = await handleUser.updateUser(action, email);
    if (updateUser.error) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: updateUser.error });
    }
    return res.status(HttpStatusCode.OK).json({ message: updateUser.message });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (name == "" || description == "") {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Name and Description are required" });
    }
    const addCategory = await handleCategory.addCategory(name, description);
    if (addCategory?.error) {   
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: addCategory.error });
    }
    return res.status(HttpStatusCode.OK).json({ message: addCategory.message, category : addCategory.category });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};


export const getCategory = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 1;

    const categories = await handleCategory.listCategories(page,limit);
    if (categories.category.length < 0) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Category not found" });
    }
    return res.status(HttpStatusCode.OK).json({ categories:categories.category,totalPages:categories.totalPages });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export const findCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const findCategory = await handleCategory.findCategory(id);
    if (findCategory == null) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Category not found" });
    }
    return res.status(HttpStatusCode.OK).json({ category: findCategory });
  } catch (err) {
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId, name, description } = req.body;
    const editCategoryResult = await handleCategory.editCategory(
      categoryId,
      name,
      description
    );

    if (typeof editCategoryResult === "string") {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: editCategoryResult });
    } else if (editCategoryResult.message === "edited successfully") {
      return res.status(HttpStatusCode.OK).json(editCategoryResult);
    } else {
      return res.status(404).json({ error: editCategoryResult.message });
    }
  } catch (err: any) {
    if (err.message.startsWith("Invalid category ID")) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteCategory = await handleCategory.deleteCategory(id);
    if (deleteCategory == null) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "Somthing wrong in delete category" });
    }
    return res.status(HttpStatusCode.OK).json({ message: "Category deleted successfuly" });
  } catch (err: any) {
    if (err.message.startsWith("Invalid category ID")) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

export const addSubcategory =async(req:Request,res:Response)=>{
  try{
    const {name,description,category}=req.body
    const createSubcategory=await handleCategory.addSubCategory(name,description,category)
    if(createSubcategory==undefined){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Something error in adding subcategory'})
    }
    return res.status(HttpStatusCode.OK).json({message:'Subcategory added',subCategory:createSubcategory})
  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}


export const getSubcategory= async(req:Request,res:Response)=>{
  try{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 7;
    const getSubcategories=await handleCategory.getSubCategories(page,limit)
    if(getSubcategories==undefined){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'There is no subcategories'})
    }
    return res.status(HttpStatusCode.OK).json({SubCategories:getSubcategories.subCategory,totalPages:getSubcategories.totalPages})
  }catch(err){
    console.log(err);
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

export const findSubcategorybyId = async (req:Request,res:Response)=>{
  try{
    const { id } = req.params;
    
    const findSubCategory=await handleCategory.getSubCategoryById(id)
    console.log(findSubCategory);
    
    if (findSubCategory == null) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Subcategory not found" });
    }
    return res.status(HttpStatusCode.OK).json({ SubCategory: findSubCategory });
  }catch(err:any){
    if (err.message.startsWith("Invalid category ID")) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
  
}


export const editSubCategory = async (req: Request, res: Response) => {
  try {
    const {subcategoryId,name,description,category} =req.body
    const editSubCategoryResult = await handleCategory.editSubCategory(
      subcategoryId,
      {name,description,category}
    );

    if (typeof editSubCategoryResult === "string") {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: editSubCategoryResult });
    } else if (editSubCategoryResult.message === "edited successfully") {
      return res.status(HttpStatusCode.OK).json(editSubCategoryResult);
    } else {
      return res.status(404).json({ error: editSubCategoryResult.message });
    }
  } catch (err: any) {
    if (err.message.startsWith("Invalid Subcategory ID")) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    }
    
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};


export const deleteSubCategory = async(req:Request,res:Response)=>{
  try{
    const { id } = req.params;
    const deleteSubCategory = await handleCategory.deleteSubCategory(id);
    if (deleteSubCategory == null) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "Somthing wrong in delete subcategory" });
    }
    return res.status(HttpStatusCode.OK).json({ message: "Subcategory deleted successfuly" });

  }catch(err:any){
    if (err.message.startsWith("Invalid Subcategory ID")) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: err.message });
    }
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

export const userPosts = async (req:Request,res:Response)=>{
  try{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 7;
    const userPosts= await handleUser.userPosts(page,limit)
    if(userPosts==undefined){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'There is no posts'})
    }
    return res.status(HttpStatusCode.OK).json({userPosts:userPosts.userPosts,totalPages:userPosts.totalPages})
  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

export const handleBlockUserPost = async (req:Request,res:Response)=>{
  try{
    const {proid}=req.params
    const {isBlock}=req.body
   const handleBlock= await handleUser.handleBlock(proid,isBlock)
   if(handleBlock==null){
    return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Somethig went wrong in change status'})
   }
   return res.status(HttpStatusCode.OK).json({handleBlock})
  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

export const handleBlockGig= async (req:Request,res:Response)=>{
  try{
    const {proid}=req.params
    const {isBlock}=req.body
   const handleBlock= await handleUser.handleBlockGig(proid,isBlock)
   if(handleBlock==null){
    return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Somethig went wrong in change status'})
   }
   return res.status(HttpStatusCode.OK).json({handleBlock})
  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

export const freelancerGig = async (req:Request,res:Response)=>{
  try{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 7;
    const userPosts= await handleUser.freelancerGig(page,limit)
    if(userPosts==undefined){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'There is no posts'})
    }
    return res.status(HttpStatusCode.OK).json({freelancerWork:userPosts.userPosts,totalPages:userPosts.totalPages})
  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}

export const reports = async (req:Request,res:Response)=>{
  try{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 7;
    const reports= await handleUser.reports(page,limit)
    if(reports==null){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'Something went wrong'})
    }
    return res.status(HttpStatusCode.OK).json({reports:reports.reports,totalPages:reports.totalPages})
  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}


export const dashboard = async (req:Request,res:Response)=>{
  try{
    const dashboard= await handleUser.dashboard()
    if(dashboard==null){
      return res.status(HttpStatusCode.BAD_REQUEST).json({error:'No data available'})
    }
    return res.status(HttpStatusCode.OK).json({dashboard})

  }catch(err){
    return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
}