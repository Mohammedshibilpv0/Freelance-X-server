import { Router } from 'express';
import multer from 'multer';
import { editUser,editUserProfileImage, switchRole,subcategories,findUser} from '../../../controllers/user/userController';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';

const router=Router()
const upload = multer({ storage: multer.memoryStorage() });

router.post('/editprofile',authMiddleware,editUser)
router.post('/upload',upload.single('file'),authMiddleware,editUserProfileImage)
router.put('/switchuserrole',authMiddleware,switchRole)
router.get('/subcategories/:id',authMiddleware,subcategories)
router.get('/user/:id',authMiddleware,findUser)








export default router