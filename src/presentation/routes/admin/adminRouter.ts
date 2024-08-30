import { Router } from 'express';
import { adminLogin,listallusers,updateUserStatus,addCategory,getCategory,findCategory
    ,editCategory,deleteCategory,addSubcategory,getSubcategory,findSubcategorybyId,
    editSubCategory,deleteSubCategory
} from '../../../controllers/admin/adminController';
import adminMiddleware from '../../../infrastructure/middleware/authMiddleware';

const  router=Router()

/////auth and user block
router.post('/auth/login',adminLogin)
router.get('/users',adminMiddleware(true),listallusers)
router.put('/updateUserBlockStatus',adminMiddleware(true),updateUserStatus)


/// category and subcategory
router.get('/categories',getCategory)
router.post('/category',adminMiddleware(true),addCategory)
router.put('/category',adminMiddleware(true),editCategory)
router.get('/findcategory/:id',findCategory)
router.put('/deletecategory/:id',adminMiddleware(true),deleteCategory)
router.post('/subcategory',adminMiddleware(true),addSubcategory)
router.get('/subcategories',getSubcategory)
router.get('/findsubcategory/:id',adminMiddleware(true),findSubcategorybyId)
router.put('/subcategory',adminMiddleware(true),editSubCategory)
router.put('/deleteSubCategory/:id',adminMiddleware(true),deleteSubCategory)


export default router