import { Router } from 'express';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';
import { createGig,freelanceWorks,findSinglegig,gigs,changeStatus,requestProject,findMyRequests,myApprovedProjects,setModuleClient,setModuleFreelancer,deleteGig,editGig} from '../../../controllers/user/freelancerController';
const router=Router()



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
router.put('/deleteproject/:projectId',authMiddleware(),deleteGig)
router.put('/editgig/:id',authMiddleware(),editGig)
export default router