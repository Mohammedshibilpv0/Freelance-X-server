import { Router } from 'express';
import multer from 'multer';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';
import { createPost,uploadImage ,getClientPost,userPosts,listPosts,requestProject,changeStatus,findMyRequests,myApprovedProjects,createCheckout,successPayment,deleteProject,editPost} from '../../../controllers/user/ClientContoller';
const router=Router()
const upload = multer({ storage: multer.memoryStorage() });



router.post('/upload',upload.single('image'),authMiddleware(),uploadImage)
router.post('/createclientpost', authMiddleware(),createPost);
router.get('/getuserspost/:email',authMiddleware(),userPosts)
router.get('/post/:id',authMiddleware(),getClientPost)
router.get('/posts',authMiddleware(),listPosts)
router.post('/requestproject',authMiddleware(),requestProject)
router.put('/projectstatus/:id/:status',authMiddleware(),changeStatus)
router.get('/myrequests/:email',authMiddleware(),findMyRequests)
router.get('/approved/:email',authMiddleware(),myApprovedProjects)
router.post('/create-checkout',authMiddleware(),createCheckout)
router.post('/successpayment/:token',authMiddleware(),successPayment)
router.put('/deleteproject/:projectId',authMiddleware(),deleteProject)
router.put('/editclientpost/:id',authMiddleware(),editPost)
export default router