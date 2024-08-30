import { Router } from 'express';
import multer from 'multer';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';
import { createGig,freelanceWorks,findSinglegig,gigs,changeStatus,requestProject,findMyRequests,myApprovedProjects,setModuleClient,setModuleFreelancer} from '../../../controllers/user/freelancerController';
import { auth } from 'firebase-admin';
const router=Router()
const upload = multer({ storage: multer.memoryStorage() });


router.post('/creategig',authMiddleware(),createGig)
router.get('/getfreelancerwork/:email',authMiddleware(),freelanceWorks)
router.get('/gig/:id',authMiddleware(),findSinglegig)
router.get('/gig',authMiddleware(),gigs)
router.post('/requestproject',authMiddleware(),requestProject)
router.put('/projectstatus/:id/:status',authMiddleware(),changeStatus)
router.get('/myrequests/:email',authMiddleware(),findMyRequests)
router.get('/approved/:email',authMiddleware(),myApprovedProjects)
router.put('/clientmodule/:id',authMiddleware(),setModuleClient)
router.put('/freelancermodule/:id',authMiddleware(),setModuleFreelancer)
export default router