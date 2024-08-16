import { Router } from 'express';
import multer from 'multer';
import { editUser,editUserProfileImage, switchRole,subcategories} from '../../../controllers/user/userController';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';
import { createPost } from '../../../controllers/user/ClientContoller';

const router=Router()
const upload = multer({ storage: multer.memoryStorage() });

router.post('/editprofile',authMiddleware,editUser)
router.post('/upload',upload.single('file'),authMiddleware,editUserProfileImage)
router.put('/switchuserrole',authMiddleware,switchRole)
router.get('/subcategories/:id',authMiddleware,subcategories)









export default router