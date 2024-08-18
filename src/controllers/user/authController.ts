import  { Request, Response } from 'express';
import UserRepository from '../../infrastructure/repositories/UserRepository';
import RegisterUser from '../../use-cases/auth/Register';
import Otp from '../../infrastructure/database/models/OtpModel';
import { sendOtpEmail } from '../../utils/sendOtp';
import redisClient from '../../utils/redisClient';
import bcrypt from 'bcrypt'
import {validate,validateEmail } from '../../use-cases/auth/validation';
import { generateAccessToken,generateRefreshToken, verifyRefreshToken } from '../../interface/security/jwt';
import CreateOtp from '../../use-cases/auth/forgetPasswordUsecase';
import forgetPasswordUsecase from '../../use-cases/auth/forgetPasswordUsecase';


const userRepository= new UserRepository()
const createotp=new CreateOtp(userRepository)
const forgetPasswordusecase=new forgetPasswordUsecase(userRepository)
const registerUser = new RegisterUser(userRepository);

const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'strict' as const,
};




export const register = async (req: Request, res: Response) => {
  let { email, password } = req.body;
  try {
    email = email.toLowerCase();
    const user = await userRepository.findByEmail(email);
    if(user){
      return res.status(400).json({error: 'Email is already in use'})
    }
    const userData = JSON.stringify({ email, password });
    await redisClient.setEx(`email${email}`,3600,userData)

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) { 
    if (err instanceof Error) {
      if (err.message === 'Email is already in use') {
        res.status(400).json({ error: 'Email is already in use' });
      } else if (err.message === 'Invalid email format') {
        res.status(400).json({ error: 'Invalid email format' });
      } else if (err.message === 'Weak password') {
        res.status(400).json({ error: 'Weak password' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

export const generateOtp = async (req: Request, res: Response) => {
  let { email } = req.body;
  email = email.toLowerCase();
  const user = await userRepository.findByEmail(email);

  if (user) {
    return res.status(404).json({ error: 'Email already verified' });
  }

  let otp = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  try {
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error sending OTP email' });
  }
};



export const verifyOTP = async (req: Request, res: Response) => {
  try {
    let { email, otp } = req.body;
    
    const userDataString = await redisClient.get(`email${email}`);
        
    if (!userDataString) {
      return res.status(400).json({ error: 'User not found in session' });
    }
    
    const userData = JSON.parse(userDataString) as { email: string; password: string };
    
    email = email.toLowerCase();

    const otpUser = await Otp.findOne({ email: email });

    if (!otpUser) {
      return res.json({ error: 'User not found or OTP expired' });
    }

    if (otp !== otpUser.otp) {
      return res.json({ error: 'Incorrect OTP' });
      
    }

    if (otpUser.expiresAt < new Date()) {

      return res.json({ error: 'OTP is expired' });
      
    }

  
    await registerUser.execute(userData);
    res.status(200).json({ message: 'User verified successfully' });
  } catch (err) {
    console.error('Error in verify OTP:', err);
    res.status(500).json({ message: 'Error in verify OTP' });
  }

}


export const loginUser= async(req:Request,res:Response)=>{
  try{
    let {email,password}=req.body
    const checkUserData=validate(email,password)    
    if(checkUserData && checkUserData.isValid){
      const user=await userRepository.findByEmail(email)
      if(user){
        const bcryptPassword=await bcrypt.compare(password,user.password)
       if(!bcryptPassword){
        return res.json({error:"Incorrect password"})
      }
      if(user.isBlock){
        return res.json({error:"User is Blocked by Admin"})
       }
        const accessToken= generateAccessToken(user)
        const refreshToken= generateRefreshToken(user)
        let userObject={
          email:user?.email,
          phone:user?.phone,
          firstName:user?.firstName,
          secondName:user?.secondName,
          description:user?.description,
          skills:user?.skills,
          country:user?.country,
          profile:user?.profile,
          role:user?.role
        }
        delete (user as any).password
        user.refreshToken =refreshToken
        userRepository.updateUser(user,user.email)


        res.cookie('accessToken', accessToken, {
          ...cookieOptions,
          maxAge: 15 * 60 * 1000,
        });


        res.cookie('refreshToken', refreshToken, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, 
        });


        return res.status(200).json({message:"Login successfully",userObject})
      }else{
        return res.json({error:"User not found"})
      }
    }else{
      return res.json({error:checkUserData.messages[0]})
    }
   
  }catch(err){
    console.log(err);
    return res.status(500).json({error:"Error in login",err})  
  }

}
export const refreshAccessTokenController = async (req: Request, res: Response) => {
  try {
      const refreshToken=req.cookies.refreshToken?req.cookies.refreshToken:req.cookies.adminrefreshToken
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await userRepository.findByEmail(decoded.email);

    if (user === null) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.refreshToken !== refreshToken) {
      res.clearCookie('refreshToken');
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    if (user.refreshToken === refreshToken) {
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);
      
      user.refreshToken = newRefreshToken; 

    
      await userRepository.updateUser(user,user.email);
      res.cookie('accessToken', newAccessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });


      res.cookie('refreshToken', newRefreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });

      return res.status(200).json({message:"Access token updated"});
    } else {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const forgetPassword=async(req:Request,res:Response)=>{
  try{
    const {email}=req.body
    const checkmail=validateEmail(email.toLowerCase())
    if(!checkmail.isValid)return res.status(400).json({error:checkmail.message})
    const otp= await createotp.createOtp(email)
    if(otp){
      return res.status(200).json({message:"OTP sent successfully"})
    }  
    return res.status(400).json({error:'User not found'})
  }catch(err){
    return res.status(500).json({ error: 'Internal server error' });
  }
}


export const verifyforgetpasswordOtp=async(req:Request,res:Response)=>{
  try{
    let {email,otp}=req.body
    const checkmail=validateEmail(email.toLowerCase())
    if(!checkmail.isValid)return res.status(400).json({error:checkmail.message})
    const checkOtp=await forgetPasswordusecase.verifyForgetOtp(email,otp)
    if(checkOtp=='User Not Found'){
      res.status(400).json({error:"User not found"})
    }else if(checkOtp=='Incorrect Otp'){
      res.status(400).json({error:"Incorrect otp"})
    }else if(checkOtp=='Otp has expired'){
      res.status(400).json({error:"Otp has expired please try again later"})
    }else if(checkOtp=='Otp verified'){
      res.status(200).json({message:"Otp verified"})
    }else{
      res.status(400).json({error:"Something wrong please try again later"})
    }
    
  }catch(err){
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


export  const changePassword=async (req:Request,res:Response)=>{
  try{
    const {email,password}=req.body
    const checkBodyData=validate(email,password)
    if(!checkBodyData.isValid){
      return res.status(400).json({error:checkBodyData.messages[0]})
    }
    const change=await forgetPasswordusecase.changepassword(email,password)
    if(change=="User not found"){
      return res.status(400).json({error:"User not found"})
    }else if(change=="User Details Changed"){
      return res.status(200).json({message:"User Details Changed"})
    }else{
      return res.status(400).json({error:"Something wrong please try again later"})
    }
  }catch(err){
    console.log(err);
    
  }
}




