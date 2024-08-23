import { Router } from 'express';
import multer from 'multer';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';
import { createGig,freelanceWorks,findSinglegig,gigs,changeStatus,requestProject} from '../../../controllers/user/freelancerController';
const router=Router()
const upload = multer({ storage: multer.memoryStorage() });


router.post('/creategig',authMiddleware,createGig)
router.get('/getfreelancerwork/:email',authMiddleware,freelanceWorks)
router.get('/gig/:id',authMiddleware,findSinglegig)
router.get('/gig',authMiddleware,gigs)
router.post('/requestproject',authMiddleware,requestProject)
router.put('/projectstatus/:id/:status',authMiddleware,changeStatus)



export default router