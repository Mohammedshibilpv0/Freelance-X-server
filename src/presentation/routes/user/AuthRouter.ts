import { Router } from 'express';
import { register,generateOtp,verifyOTP,loginUser,refreshAccessTokenController,forgetPassword,verifyforgetpasswordOtp,changePassword } from '../../../controllers/user/authController';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';

const router=Router()

router.post('/register',register)
router.post('/checkemail',register)
router.post('/generate-otp',generateOtp)
router.post('/verify-otp',verifyOTP)
router.post('/resendotp',generateOtp)
router.post('/userlogin',loginUser)
router.post('/refresh-token',refreshAccessTokenController)
router.post('/forgetpassword',forgetPassword)
router.post('/verifyforgetpassword',verifyforgetpasswordOtp)
router.post('/changepassword',changePassword)

export default router