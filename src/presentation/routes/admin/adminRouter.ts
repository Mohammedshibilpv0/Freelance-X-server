import { Router } from 'express';
import { adminLogin,listallusers,updateUserStatus,addCategory,getCategory,findCategory
    ,editCategory,deleteCategory,addSubcategory,getSubcategory,findSubcategorybyId,
    editSubCategory,deleteSubCategory,userPosts,handleBlockUserPost,freelancerGig,handleBlockGig,reports,dashboard

} from '../../../controllers/admin/adminController';
import adminMiddleware from '../../../infrastructure/middleware/authMiddleware';
import authMiddleware from '../../../infrastructure/middleware/authMiddleware';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const  router=Router()

router.post('/auth/login',adminLogin)
router.get('/users',adminMiddleware(true),listallusers)
router.put('/updateUserBlockStatus',adminMiddleware(true),updateUserStatus)
router.get('/categories',authMiddleware(true),getCategory)
router.post('/category',upload.single('image'),adminMiddleware(true),addCategory)
router.put('/category/:categoryId',upload.single('image'),adminMiddleware(true),editCategory)
router.get('/findcategory/:id',authMiddleware(true),findCategory)
router.put('/deletecategory/:id',adminMiddleware(true),deleteCategory)
router.post('/subcategory',adminMiddleware(true),addSubcategory)
router.get('/subcategories',authMiddleware(true),getSubcategory)
router.get('/findsubcategory/:id',adminMiddleware(true),findSubcategorybyId)
router.put('/subcategory',adminMiddleware(true),editSubCategory)
router.put('/deleteSubCategory/:id',adminMiddleware(true),deleteSubCategory)
router.get('/userposts',authMiddleware(true),userPosts)
router.patch('/user-posts/block/:proid',authMiddleware(),handleBlockUserPost)
router.get('/freelancerGig',authMiddleware(true),freelancerGig)
router.patch('/freelancer-gig/block/:proid',authMiddleware(true),handleBlockGig)
router.get('/reports',authMiddleware(true),reports)
router.get('/dashboard',authMiddleware(true),dashboard)





export default router