import { Router } from 'express';
import multer from 'multer';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';
import { createPost,uploadImage } from '../../../controllers/user/ClientContoller';
const router=Router()
const upload = multer({ storage: multer.memoryStorage() });



router.post('/upload',upload.single('image'),authMiddleware,uploadImage)
router.post('/createclientpost', createPost);




export default router