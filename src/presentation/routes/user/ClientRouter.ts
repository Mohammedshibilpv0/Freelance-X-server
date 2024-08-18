import { Router } from 'express';
import multer from 'multer';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';
import { createPost,uploadImage ,getClientPost,userPosts} from '../../../controllers/user/ClientContoller';
const router=Router()
const upload = multer({ storage: multer.memoryStorage() });



router.post('/upload',upload.single('image'),authMiddleware,uploadImage)
router.post('/createclientpost', authMiddleware,createPost);
router.get('/getuserspost/:email',authMiddleware,userPosts)
router.get('/post/:id',authMiddleware,getClientPost)



export default router