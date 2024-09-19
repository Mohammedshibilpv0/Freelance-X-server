import { Router } from 'express';
import multer from 'multer';
import { editUser,editUserProfileImage, switchRole,subcategories,findUser,categories,friendList,userMessages,getNotifications,getTransaction,handleReport} from '../../../controllers/user/userController';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';

const router=Router()
const upload = multer({ storage: multer.memoryStorage() });

router.post('/editprofile',authMiddleware(),editUser)
router.post('/upload',upload.single('file'),authMiddleware(),editUserProfileImage)
router.put('/switchuserrole',authMiddleware(),switchRole)
router.get('/subcategories/:id',authMiddleware(),subcategories)
router.get('/user/:id',authMiddleware(),findUser)
router.get('/categories',authMiddleware(),categories)
router.get('/findmyfriends/:id',authMiddleware(),friendList)
router.get('/messages/:id',authMiddleware(),userMessages)
router.get('/notifications/:id',authMiddleware(),getNotifications)
router.get('/transaction/:id',authMiddleware(),getTransaction)
router.post('/reportuser',authMiddleware(),handleReport)
export default router