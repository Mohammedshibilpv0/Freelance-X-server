import { Router } from "express";
import authRouter from './user/AuthRouter'
import userRouter from './user/userRouter'
import adminRouter from '../routes/admin/adminRouter'
import clientRouter from '../routes/user/ClientRouter'
import FreelacerRouter from '../routes/user/FreelancerRouter'
const router=Router()

router.use('/user/auth',authRouter)
router.use('/user',userRouter)
router.use('/admin',adminRouter)
router.use('/client',clientRouter)
router.use('/freelancer',FreelacerRouter)

export default router;